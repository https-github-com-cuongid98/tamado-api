import Member from "$entities/Member";
import MemberFollow from "$entities/MemberFollow";
import MemberBlock from "$entities/MemberBlock";
import {
  ErrorCode,
  MemberStatus,
  ShowLocation,
  Following,
  RedirectType,
  CommonStatus,
} from "$enums";
import { getConnection, getRepository, In } from "typeorm";
import MemberDetail from "$entities/MemberDetail";
import MemberImage from "$entities/MemberImage";
import { isOnline } from "$helpers/socket";
import Notification from "$entities/Notification";
import { pushNotificationToMember } from "$helpers/oneSignal";
import MemberHobby from "$entities/MemberHobby";
import Hobby from "$entities/Hobby";
import { returnPaging } from "$helpers/utils";

export async function searchMember(params: {
  memberId: number;
  lat: number;
  lng: number;
  distanceSearch: number;
  gender?: number;
  jobId?: number;
  hobbyIds?: number[];
}) {
  const memberRepository = getRepository(Member);
  const memberBlockRepository = getRepository(MemberBlock);

  const queryBuilder = memberRepository
    .createQueryBuilder("member")
    .where(`member.status = ${MemberStatus.ACTIVE}`)
    .andWhere(`member.showLocation = ${ShowLocation.YES}`)
    .andWhere(`member.id != :memberId`, { memberId: params.memberId })
    .innerJoin("member.memberDetail", "memberDetail")
    .select([
      "member.id id",
      "member.avatar avatar",
      "memberDetail.name name",
      "member.lat lat",
      "member.lng lng",
      `ST_Distance_Sphere(
        ST_GeomFromText(CONCAT('POINT(', member.lat,' ', member.lng,')'), 4326),
        ST_GeomFromText('POINT(${params.lat} ${params.lng})', 4326)
      ) as distanceGeo`,
    ])
    .andWhere(
      `ST_Distance_Sphere(
      ST_GeomFromText(CONCAT('POINT(', member.lat, ' ', member.lng,')'), 4326),
      ST_GeomFromText('POINT(${params.lat} ${params.lng})', 4326)
    ) <= :distanceSearch`,
      { distanceSearch: params.distanceSearch }
    );

  if (params.gender) {
    queryBuilder.andWhere("memberDetail.gender = :gender", {
      gender: params.gender,
    });
  }

  if (params.jobId) {
    queryBuilder.andWhere("memberDetail.jobId = :jobId", {
      jobId: params.jobId,
    });
  }

  if (params.hobbyIds && params.hobbyIds?.length > 0) {
    queryBuilder
      .leftJoin("member.memberHobbies", "memberHobby")
      .andWhere("memberHobby.hobbyId IN (:hobbyIds)", {
        hobbyIds: params.hobbyIds,
      });
  }

  const members = await queryBuilder
    .orderBy("distanceGeo", "ASC")
    .groupBy("member.id ")
    .getRawMany();

  const listBlocks = await memberBlockRepository.find({
    where: [{ memberId: params.memberId }, { targetId: params.memberId }],
  });

  const memberSearch = members.filter((member) => {
    const checkBlock = listBlocks.find(
      (block) => block.memberId == member.id || block.targetId == member.id
    );
    if (!checkBlock) return member;
  });

  return memberSearch;
}

export async function getMemberDetailById(memberId: number, targetId: number) {
  const memberRepository = getRepository(Member);
  const memberBlockRepository = getRepository(MemberBlock);

  if (memberId == targetId) throw ErrorCode.Invalid_Input;

  const memberBlock = await memberBlockRepository.find({
    memberId: In([memberId, targetId]),
    targetId: In([memberId, targetId]),
  });

  if (memberBlock.length > 0) throw ErrorCode.Blocked;

  const member = await memberRepository
    .createQueryBuilder("member")
    .innerJoin("member.memberDetail", "memberDetail")
    .addSelect([
      "memberDetail.name",
      "memberDetail.gender",
      "memberDetail.email",
      "memberDetail.birthday",
      "memberDetail.introduce",
      "memberDetail.jobId",
    ])
    .leftJoin("member.memberImages", "memberImage")
    .addSelect(["memberImage.URL"])
    .leftJoin("member.memberHobbies", "memberHobby")
    .addSelect(["memberHobby.hobbyId"])
    .leftJoin("memberHobby.hobby", "hobby")
    .addSelect(["hobby.hobby"])
    .leftJoin("memberDetail.job", "job")
    .addSelect(["job.jobName"])
    .leftJoinAndMapMany(
      "member.memberFollowed",
      "MemberFollow",
      "memberFollowed",
      "memberFollowed.targetId = member.id"
    )
    .where(`member.status = ${MemberStatus.ACTIVE}`)
    .andWhere("member.id = :targetId", { targetId })
    .getOne();

  if (!member) throw ErrorCode.Member_Not_Exist;

  const checkFollow = member["memberFollowed"]?.find(
    (x) => x.memberId == memberId
  );

  return {
    ...member,
    memberHobbies: member.memberHobbies.map((memberHobby) => {
      return {
        hobbyId: memberHobby.hobbyId,
        hobbyName: memberHobby.hobby.hobby,
      };
    }),
    isFollow: checkFollow ? Following.YES : Following.NO,
    memberFollowed: member["memberFollowed"]?.length,
  };
}

export async function followMember(memberId: number, targetId: number) {
  return getConnection().transaction(async (transaction) => {
    const memberRepository = transaction.getRepository(Member);
    const memberFollowRepository = transaction.getRepository(MemberFollow);
    const memberBlockRepository = transaction.getRepository(MemberBlock);
    const notificationRepository = transaction.getRepository(Notification);

    const member = await memberRepository.findOne({
      where: { id: memberId },
      relations: ["memberDetail"],
    });
    const target = await memberRepository.findOne({
      where: { id: targetId },
      relations: ["memberDetail"],
    });

    if (member.status != CommonStatus.ACTIVE) throw ErrorCode.Member_Blocked;

    if (memberId == targetId) throw ErrorCode.You_Can_Not_Follow_Yourself;

    const memberFollow = { memberId, targetId };

    const checkBlock = await memberBlockRepository.findOne({
      where: [memberFollow, { memberId: targetId, targetId: memberId }],
    });

    if (checkBlock) throw ErrorCode.Blocked;

    const checkMemberFollow = await memberFollowRepository.findOne(
      memberFollow
    );

    const notificationObj = new Notification();
    notificationObj.memberId = targetId;
    notificationObj.redirectId = memberId;
    notificationObj.redirectType = RedirectType.MEMBER;

    if (checkMemberFollow) {
      await memberFollowRepository.delete(memberFollow);
      notificationObj.content = `${member.memberDetail.name} unfollowed you!`;
    } else {
      if (target.status != CommonStatus.ACTIVE) throw ErrorCode.Member_Blocked;
      await memberFollowRepository.save(memberFollow);
      notificationObj.content = `${member.memberDetail.name} followed you!`;
    }

    await notificationRepository.save(notificationObj);
    if (target.receiveNotification == CommonStatus.ACTIVE) {
      await pushNotificationToMember(notificationObj);
    }
  });
}

export async function getMyProfile(memberId: number) {
  const memberRepository = getRepository(Member);
  const memberFollowRepository = getRepository(MemberFollow);
  const memberBlockRepository = getRepository(MemberBlock);

  const profile = await memberRepository
    .createQueryBuilder("member")
    .leftJoin("member.memberDetail", "memberDetail")
    .addSelect([
      "memberDetail.name",
      "memberDetail.gender",
      "memberDetail.email",
      "memberDetail.birthday",
      "memberDetail.introduce",
    ])
    .leftJoin("memberDetail.job", "job")
    .addSelect(["job.jobName"])
    .leftJoin("member.memberImages", "memberImage")
    .addSelect(["memberImage.URL"])
    .leftJoin("member.memberHobbies", "memberHobby")
    .addSelect(["memberHobby.hobbyId"])
    .leftJoin("memberHobby.hobby", "hobby")
    .addSelect(["hobby.hobby"])
    .where("member.id = :memberId", { memberId })
    .getOne();

  const memberFollowed = await memberFollowRepository.count({ memberId });
  const memberFollowing = await memberFollowRepository.count({
    targetId: memberId,
  });
  const memberBlock = await memberBlockRepository
    .createQueryBuilder("memberBlock")
    .select([
      "member.id memberId",
      "member.avatar avatar",
      "memberDetail.name name",
    ])
    .leftJoin(Member, "member", "memberBlock.targetId = member.id")
    .leftJoin("member.memberDetail", "memberDetail")
    .where("memberBlock.memberId = :memberId", { memberId })
    .getRawMany();

  return {
    ...profile,
    memberHobbies: profile.memberHobbies.map((memberHobby) => {
      return {
        hobbyId: memberHobby.hobbyId,
        hobbyName: memberHobby.hobby.hobby,
      };
    }),
    memberFollowed,
    memberFollowing,
    memberBlock,
  };
}

export async function blockMember(memberId: number, targetId: number) {
  return getConnection().transaction(async (transaction) => {
    const memberBlockRepository = transaction.getRepository(MemberBlock);
    const memberFollowRepository = transaction.getRepository(MemberFollow);

    if (memberId == targetId) throw ErrorCode.You_Can_Not_Follow_Yourself;

    const memberBlock = { memberId, targetId };

    const checkFollow = await memberFollowRepository.find({
      where: [memberBlock, { memberId: targetId, targetId: memberId }],
    });

    for (const follow of checkFollow) {
      const { memberId, targetId } = follow;
      await memberFollowRepository.delete({ memberId, targetId });
    }

    const checkMemberBlock = await memberBlockRepository.findOne(memberBlock);

    if (checkMemberBlock) {
      await memberBlockRepository.delete(memberBlock);
    } else {
      await memberBlockRepository.save(memberBlock);
    }
  });
}

interface UpdateMyProfile {
  avatar?: string;
  showLocation?: number;
  receiveNotification?: number;
  detail?: memberDetail;
  images?: string[];
  hobbyIds?: number[];
}
interface memberDetail {
  name?: string;
  gender?: number;
  email?: string;
  birthday?: string;
  introduce?: string;
  jobId?: number;
}
export async function editMyProfile(memberId: number, params: UpdateMyProfile) {
  return getConnection().transaction(async (transaction) => {
    const memberRepo = transaction.getRepository(Member);
    const memberDetailRepo = transaction.getRepository(MemberDetail);
    const memberImageRepo = transaction.getRepository(MemberImage);
    const memberHobbyRepo = transaction.getRepository(MemberHobby);
    const hobbyRepo = transaction.getRepository(Hobby);

    const { detail, images, hobbyIds } = params;
    delete params.detail;
    delete params.images;
    delete params.hobbyIds;

    if (detail) {
      await memberDetailRepo.update({ memberId }, detail);
    }

    if (images) {
      await memberImageRepo.save(
        images.map((image) => {
          return {
            memberId,
            URL: image,
          };
        })
      );
    }

    if (hobbyIds) {
      const hobbies = await hobbyRepo.count({
        where: { id: In(hobbyIds), status: CommonStatus.ACTIVE },
      });

      if (hobbyIds.length != hobbies) throw ErrorCode.Invalid_Input;

      await memberHobbyRepo.delete({ memberId });

      await memberHobbyRepo.save(
        hobbyIds.map((hobbyId) => {
          return {
            memberId,
            hobbyId,
          };
        })
      );
    }

    await memberRepo.update({ id: memberId }, params);
  });
}

export async function updateGPS(
  memberId: number,
  params: { lat: number; lng: number }
) {
  return getConnection().transaction(async (transaction) => {
    const memberRepo = transaction.getRepository(Member);

    await memberRepo.update({ id: memberId }, params);
  });
}

export async function getMemberOnline(memberId: number) {
  const memberFollowRepository = getRepository(MemberFollow);

  const listMemberFollowed = await memberFollowRepository
    .createQueryBuilder("memberFollow")
    .select(["member.id id", "member.avatar avatar", "memberDetail.name name"])
    .innerJoin("Member", "member", "memberFollow.targetId = member.id")
    .innerJoin("member.memberDetail", "memberDetail")
    .where("memberFollow.memberId = :memberId", { memberId })
    .andWhere(`member.status = ${MemberStatus.ACTIVE}`)
    .getRawMany();

  const role = 1;
  const listOnline = listMemberFollowed.filter((memberFollow) => {
    const id = memberFollow.id;
    if (isOnline(id, role)) return memberFollow;
  });

  return listOnline;
}

export async function getFollower(
  memberId: number,
  params: { take: number; skip: number; keyword?: string }
) {
  const memberFollowRepository = getRepository(MemberFollow);

  const queryBuilder = memberFollowRepository
    .createQueryBuilder("memberFollow")
    .select([
      "member.id id",
      "member.avatar avatar",
      "memberDetail.name name",
      "memberDetail.introduce introduce",
      "memberDetail.birthday birthday",
    ])
    .innerJoin("Member", "member", "memberFollow.memberId = member.id")
    .innerJoin("member.memberDetail", "memberDetail")
    .where("memberFollow.targetId = :memberId", { memberId })
    .andWhere(`member.status = ${MemberStatus.ACTIVE}`);

  if (params.keyword) {
    queryBuilder.andWhere("memberDetail.name LIKE :keyword", {
      keyword: `%${params.keyword}%`,
    });
  }

  const totalItems = await queryBuilder.getCount();
  const listFollower = await queryBuilder
    .limit(params.take)
    .offset(params.skip)
    .getRawMany();

  return returnPaging(listFollower, totalItems, params);
}

export async function getFollowed(
  memberId: number,
  params: { take: number; skip: number; keyword?: string }
) {
  const memberFollowRepository = getRepository(MemberFollow);

  const queryBuilder = memberFollowRepository
    .createQueryBuilder("memberFollow")
    .select([
      "member.id id",
      "member.avatar avatar",
      "memberDetail.name name",
      "memberDetail.introduce introduce",
      "memberDetail.birthday birthday",
    ])
    .innerJoin("Member", "member", "memberFollow.targetId = member.id")
    .innerJoin("member.memberDetail", "memberDetail")
    .where("memberFollow.memberId = :memberId", { memberId })
    .andWhere(`member.status = ${MemberStatus.ACTIVE}`);

  if (params.keyword) {
    queryBuilder.andWhere("memberDetail.name LIKE :keyword", {
      keyword: `%${params.keyword}%`,
    });
  }

  const totalItems = await queryBuilder.getCount();
  const listFollowed = await queryBuilder
    .limit(params.take)
    .offset(params.skip)
    .getRawMany();

  return returnPaging(listFollowed, totalItems, params);
}

export async function getListBlock(
  memberId: number,
  params: { take: number; skip: number; keyword?: string }
) {
  const memberBlockRepository = getRepository(MemberBlock);

  const queryBuilder = memberBlockRepository
    .createQueryBuilder("memberBlock")
    .select([
      "member.id id",
      "member.avatar avatar",
      "memberDetail.name name",
      "memberDetail.introduce introduce",
      "memberDetail.birthday birthday",
    ])
    .innerJoin("Member", "member", "memberBlock.targetId = member.id")
    .innerJoin("member.memberDetail", "memberDetail")
    .where("memberBlock.memberId = :memberId", { memberId })
    .andWhere(`member.status = ${MemberStatus.ACTIVE}`);

  if (params.keyword) {
    queryBuilder.andWhere("memberDetail.name LIKE :keyword", {
      keyword: `%${params.keyword}%`,
    });
  }

  const totalItems = await queryBuilder.getCount();
  const listFollowed = await queryBuilder
    .limit(params.take)
    .offset(params.skip)
    .getRawMany();

  return returnPaging(listFollowed, totalItems, params);
}
