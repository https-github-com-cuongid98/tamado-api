import {
  getRepository,
  EntityManager,
  getConnection,
  Repository,
  MoreThan,
} from "typeorm";
import { ErrorCode, MemberStatus, VerifiedCodeStatus } from "$enums";
import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { pick } from "lodash";
import { promisify } from "util";
import to from "await-to-js";
import config from "$config";
import VerifiedCode from "$entities/VerifiedCode";
import { randomOTP } from "$helpers/utils";
import moment from "moment";
import Member from "$entities/Member";
const verifyAsync = promisify(verify) as any;

export async function getMemberById(memberId: number) {
  const memberRepository = getRepository(Member);
  const member = await memberRepository.findOne({ id: memberId });
  return member;
}

// interface LoginParams {
//   phone: string;
//   password: string;
// }
// export async function login(params: LoginParams) {
//   const memberRepository = getRepository(Member);
//   const { phone, password } = params;

//   const member = await memberRepository.findOne({ phone });

//   if (!member) throw ErrorCode.Email_Or_Password_Invalid;
//   if (member.status !== MemberStatus.ACTIVE) throw ErrorCode.Member_Blocked;

//   const isTruePassword = await compare(password, member.password);
//   if (!isTruePassword) throw ErrorCode.Email_Or_Password_Invalid;

//   return generateToken(member.id);
// }

// interface ChangePasswordParams {
//   oldPassword: string;
//   newPassword: string;
// }
// export async function changePassword(
//   memberId: number,
//   params: ChangePasswordParams
// ) {
//   const repoMember = getRepository(Member);
//   const { oldPassword, newPassword } = params;
//   if (oldPassword === newPassword) throw ErrorCode.Invalid_Input;

//   const member = await repoMember.findOne(memberId, { select: ["password"] });
//   if (!member) throw ErrorCode.Member_Not_Exist;

//   const isTruePassword = await compare(oldPassword, member.password);
//   if (!isTruePassword) throw ErrorCode.Password_Invalid;

//   const passwordHash = await hash(newPassword, config.auth.SaltRounds);
//   await repoMember.update(memberId, { password: passwordHash });
//   return;
// }

export async function generateToken(memberId: number) {
  const memberRepository = getRepository(Member);
  const member = await getMemberById(memberId);

  const dataEncode = pick(member, ["id", "status", "phone"]);
  const token = generateAccessToken(dataEncode);
  const oldRefreshToken = member.refreshToken;
  const [error] = await to(
    verifyAsync(oldRefreshToken, config.auth.RefreshTokenSecret)
  );

  if (error) {
    const dataEncodeRefreshToken = pick(member, ["id", "status", "phone"]);
    const newRefreshToken = generateRefreshToken(dataEncodeRefreshToken);
    await memberRepository.update(memberId, { refreshToken: newRefreshToken });
    return { token, refreshToken: newRefreshToken };
  }

  return { token, refreshToken: oldRefreshToken };
}

export async function createAccessToken(memberId: number): Promise<string> {
  const member = await getMemberById(memberId);
  const dataEncode = pick(member, ["id", "status", "phone"]);
  return generateAccessToken(dataEncode);
}

const generateAccessToken = (dataEncode: any) => {
  return sign(dataEncode, config.auth.AccessTokenSecret, {
    algorithm: "HS256",
    expiresIn: Number(config.auth.AccessTokenExpire),
  });
};

const generateRefreshToken = (dataEncode: any) => {
  return sign(dataEncode, config.auth.RefreshTokenSecret, {
    algorithm: "HS256",
    expiresIn: config.auth.RefreshTokenExpire,
  });
};

interface RequestVerifiedCodeParams {
  phone: string;
}
export async function createVerifiedCode({ phone }: RequestVerifiedCodeParams) {
  const verifiedCodeRepo = getRepository(VerifiedCode);

  let verifiedCode = await verifiedCodeRepo.findOne({
    phone,
    status: VerifiedCodeStatus.UN_USED,
  });

  if (!verifiedCode) {
    verifiedCode = new VerifiedCode();
  }
  verifiedCode.phone = phone;
  verifiedCode.code = randomOTP();
  verifiedCode.status = VerifiedCodeStatus.UN_USED;
  verifiedCode.verifiedDate = null;
  verifiedCode.expiredDate = moment()
    .add(60 * 20, "seconds")
    .toDate();
  await verifiedCodeRepo.save(verifiedCode);
  // TODO: Send verified code to email
  return;
}

interface CheckVerifiedCodeParams {
  phone: string;
  verifiedCode: string;
}
export async function checkVerifiedCode({
  phone,
  verifiedCode,
}: CheckVerifiedCodeParams) {
  const verifiedCodeRepo = getRepository(VerifiedCode);

  const { id, code, retry } = await verifiedCodeRepo.findOne({
    phone,
    status: VerifiedCodeStatus.UN_USED,
    expiredDate: MoreThan(new Date()),
  });

  if (retry > 5) throw ErrorCode.Verified_Code_Max_Try;

  if (code !== verifiedCode) {
    await verifiedCodeRepo.update({ id }, { retry: () => "`retry` + 1" });
    throw ErrorCode.Verified_Code_Invalid;
  }

  return {
    isValid: Boolean(code),
  };
}

// interface RegisterParams {
//   email: string;
//   password: string;
//   verifiedCode: string;
// }
// export async function register({
//   email,
//   password,
//   verifiedCode,
// }: RegisterParams) {
//   const isVerifiedCodeValid = (await checkVerifiedCode({ email, verifiedCode }))
//     ?.isValid;
//   if (!isVerifiedCodeValid) throw ErrorCode.Verified_Code_Invalid;
//   // const existedMember = await getMemberByEmail(email);
//   // if (existedMember) throw ErrorCode.Email_Existed;
//   const member = await getConnection().transaction(async (transaction) => {
//     const memberRepo = transaction.getRepository(Member);
//     const verifiedCodeRepo = transaction.getRepository(VerifiedCode);
//     const member = await memberRepo.save({
//       email,
//       password: await hash(password, config.auth.SaltRounds),
//     });
//     await verifiedCodeRepo.update(
//       { target: email },
//       { status: VerifiedCodeStatus.USED, verifiedDate: new Date() }
//     );
//     return member;
//   });
//   return await generateToken(member.id);
// }

// interface ResetPasswordParams {
//   email: string;
//   newPassword: string;
//   verifiedCode: string;
// }
// export async function resetPassword({
//   email,
//   newPassword,
//   verifiedCode,
// }: ResetPasswordParams) {
//   // const isVerifiedCodeValid = (await checkVerifiedCode({ email, verifiedCode }))
//   //   ?.isValid;
//   // if (!isVerifiedCodeValid) throw ErrorCode.Verified_Code_Invalid;
//   // // const member = await getMemberByEmail(email);
//   // // if (!member) throw ErrorCode.Email_Not_Exist;
//   // await getConnection().transaction(async (transaction) => {
//   //   const memberRepo = transaction.getRepository(Member);
//   //   const verifiedCodeRepo = transaction.getRepository(VerifiedCode);
//   //   await memberRepo.update(
//   //     { email },
//   //     {
//   //       password: await hash(newPassword, config.auth.SaltRounds),
//   //     }
//   //   );
//   //   await verifiedCodeRepo.update(
//   //     { target: email },
//   //     { status: VerifiedCodeStatus.USED, verifiedDate: new Date() }
//   //   );
//   //   return member;
//   // });
//   // return await generateToken(member.id);
// }
