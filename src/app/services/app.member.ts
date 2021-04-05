import Member from "$entities/Member";
import { getRepository } from "typeorm";

export async function getMyProfile(memberId: number) {
  const memberRepository = getRepository(Member);

  return await memberRepository.findOne({
    where: { id: memberId },
    relations: ["memberDetail"],
  });
}
