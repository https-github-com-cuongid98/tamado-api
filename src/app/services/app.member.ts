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

export async function searchMember(params: {
  memberId: number;
  lat: number;
  lng: number;
  distanceSearch: number;
  gender?: number;
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

  const members = await queryBuilder.orderBy("distanceGeo", "ASC").getRawMany();

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
    await pushNotificationToMember(notificationObj);
  });
}

export async function getMyProfile(memberId: number) {
  const memberRepository = getRepository(Member);
  const memberFollowRepository = getRepository(MemberFollow);
  const memberBlockRepository = getRepository(MemberBlock);

  const profile = await memberRepository.findOne({
    where: { id: memberId },
    relations: ["memberDetail", "memberImages"],
  });

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
  detail?: memberDetail[];
  memberImages?: memberImages[];
}

interface memberDetail {
  name: string;
  email: string;
  introduce: string;
  hobby: string;
}

interface memberImages {
  id: number;
  URL: string;
}
export async function editMyProfile(memberId: number, params: UpdateMyProfile) {
  return getConnection().transaction(async (transaction) => {
    const memberRepo = transaction.getRepository(Member);
    const memberDetailRepo = transaction.getRepository(MemberDetail);
    const memberImageRepo = transaction.getRepository(MemberImage);

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
