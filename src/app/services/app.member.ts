import Member from "$entities/Member";
import MemberFollow from "$entities/MemberFollow";
import MemberBlock from "$entities/MemberBlock";
import { ErrorCode, MemberStatus, ShowLocation, Following } from "$enums";
import { getRepository, In } from "typeorm";

export async function searchMember(params: {
  memberId: number;
  lat: number;
  lng: number;
  distanceSearch: number;
  gender?: number;
}) {
  const memberRepository = getRepository(Member);

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
        ST_GeomFromText( CONCAT('POINT(', member.lat, ' ', member.lng, ')'), 4326),
        ST_GeomFromText('POINT(${params.lat} ${params.lng})', 4326)
      ) as distanceGeo`,
    ])
    .andWhere(
      `ST_Distance_Sphere(
      ST_GeomFromText( CONCAT('POINT(', member.lat, ' ', member.lng, ')'), 4326),
      ST_GeomFromText('POINT(${params.lat} ${params.lng})', 4326)
    ) <= :distanceSearch`,
      { distanceSearch: params.distanceSearch }
    );

  if (params.gender) {
    queryBuilder.andWhere("memberDetail.gender = :gender", {
      gender: params.gender,
    });
  }

  const result = await queryBuilder.orderBy("distanceGeo", "ASC").getRawMany();
  return result;
}

export async function getMemberDetailById(memberId: number, targetId: number) {
  const memberRepository = getRepository(Member);
  const memberBlockRepository = getRepository(MemberBlock);

  const memberBlock = await memberBlockRepository.find({
    memberId: In([memberId, targetId]),
    targetId: In([memberId, targetId]),
  });

  if (memberBlock.length > 0) throw ErrorCode.Blocked;

  if (memberId == targetId) throw ErrorCode.Invalid_Input;

  const member = await memberRepository
    .createQueryBuilder("member")
    .innerJoin("member.memberDetail", "memberDetail")
    .addSelect([
      "memberDetail.name",
      "memberDetail.gender",
      "memberDetail.email",
      "memberDetail.birthday",
      "memberDetail.introduce",
      "memberDetail.hobby",
    ])
    .leftJoin("member.memberImage", "memberImage")
    .addSelect(["memberImage.URL"])
    .leftJoinAndMapMany(
      "member.memberFollowed",
      "MemberFollow",
      "memberFollowed",
      "memberFollowed.targetId = member.id"
    )
    .where(`member.status = ${MemberStatus.ACTIVE}`)
    .andWhere("member.id = :targetId", { targetId })
    .getOne();

  const checkFollow = member["memberFollowed"].find(
    (x) => x.memberId == memberId
  );

  return {
    ...member,
    isFollow: checkFollow ? Following.YES : Following.NO,
    memberFollowed: member["memberFollowed"].length,
  };
}

export async function followMember(memberId: number, targetId: number) {
  const memberFollowRepository = getRepository(MemberFollow);

  if (memberId == targetId) throw ErrorCode.You_Can_Not_Follow_Yourself;

  const memberFollow = { memberId, targetId };

  const checkMemberFollow = await memberFollowRepository.findOne(memberFollow);

  if (checkMemberFollow) {
    await memberFollowRepository.delete(memberFollow);
  } else {
    await memberFollowRepository.save(memberFollow);
  }
}

export async function getMyProfile(memberId: number) {
  const memberRepository = getRepository(Member);

  return await memberRepository.findOne({
    where: { id: memberId },
    relations: ["memberDetail"],
  });
}
