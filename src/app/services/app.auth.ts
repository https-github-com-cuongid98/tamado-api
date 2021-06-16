import { getRepository, getConnection, MoreThan } from "typeorm";
import {
  ErrorCode,
  MemberStatus,
  VerifiedCodeStatus,
  VerifiedCodeType,
} from "$enums";
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
import MemberDetail from "$entities/MemberDetail";
import { handlePhoneNumber, sendSMS } from "$helpers/twillio";
import MemberHobby from "$entities/MemberHobby";
const verifyAsync = promisify(verify) as any;

export async function getMemberById(memberId: number) {
  const memberRepository = getRepository(Member);
  const member = await memberRepository.findOne({ id: memberId });
  return member;
}

interface LoginParams {
  phone: string;
  password: string;
}
export async function login(params: LoginParams) {
  const memberRepository = getRepository(Member);
  const { password } = params;
  const phone = await handlePhoneNumber(params.phone);

  const member = await memberRepository.findOne({ phone });

  if (!member) throw ErrorCode.Member_Not_Exist;
  if (member.status !== MemberStatus.ACTIVE) throw ErrorCode.Member_Blocked;

  const isTruePassword = await compare(password, member.password);
  if (!isTruePassword) throw ErrorCode.Password_Invalid;

  return generateToken(member.id);
}

interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}
export async function changePassword(
  memberId: number,
  params: ChangePasswordParams
) {
  const repoMember = getRepository(Member);
  const { oldPassword, newPassword } = params;
  if (oldPassword === newPassword) throw ErrorCode.Invalid_Input;

  const member = await repoMember.findOne(memberId, { select: ["password"] });
  if (!member) throw ErrorCode.Member_Not_Exist;

  const isTruePassword = await compare(oldPassword, member.password);
  if (!isTruePassword) throw ErrorCode.Password_Invalid;

  const passwordHash = await hash(newPassword, config.auth.SaltRounds);
  await repoMember.update(memberId, { password: passwordHash });
  return;
}

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
    return { memberId, token, refreshToken: newRefreshToken };
  }

  return { memberId, token, refreshToken: oldRefreshToken };
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
  type: number;
}
export async function createVerifiedCode({
  phone,
  type,
}: RequestVerifiedCodeParams) {
  const verifiedCodeRepo = getRepository(VerifiedCode);

  const existedMember = await getMemberByPhone(phone);
  if (type == VerifiedCodeType.REGISTER && existedMember)
    throw ErrorCode.Phone_Existed;
  else if (type == VerifiedCodeType.RESET_PASSWORD && !existedMember)
    throw ErrorCode.Member_Not_Exist;

  phone = await handlePhoneNumber(phone);

  let verifiedCode = await verifiedCodeRepo.findOne({
    phone,
    status: VerifiedCodeStatus.UN_USED,
    type,
  });

  if (!verifiedCode) {
    verifiedCode = new VerifiedCode();
  }
  verifiedCode.phone = phone;
  verifiedCode.code = randomOTP(6);
  verifiedCode.status = VerifiedCodeStatus.UN_USED;
  verifiedCode.type = type;
  verifiedCode.verifiedDate = null;
  verifiedCode.expiredDate = moment()
    .add(60 * 20, "seconds")
    .toDate();
  await verifiedCodeRepo.save(verifiedCode);

  await sendSMS({ code: verifiedCode.code, to: verifiedCode.phone });

  return { code: verifiedCode.code };
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

  phone = await handlePhoneNumber(phone);

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

  await verifiedCodeRepo.update(
    { id },
    { status: VerifiedCodeStatus.USED, verifiedDate: new Date() }
  );

  return {
    isValid: Boolean(code),
  };
}

interface RegisterParams {
  phone: string;
  password: string;
  name: string;
  birthday: string;
  gender: number;
  email?: string;
  introduce?: string;
  hobbyIds?: number[];
  jobId?: number;
}
export async function register(params: RegisterParams) {
  const phone = await handlePhoneNumber(params.phone);

  const existedMember = await getMemberByPhone(phone);
  if (existedMember) throw ErrorCode.Phone_Existed;

  return await getConnection().transaction(async (transaction) => {
    const memberRepo = transaction.getRepository(Member);
    const memberDetailRepo = transaction.getRepository(MemberDetail);
    const memberHobbyRepo = transaction.getRepository(MemberHobby);

    const member = await memberRepo.save({
      phone,
      password: await hash(params.password, config.auth.SaltRounds),
    });
    delete params.password;
    delete params.phone;

    if (params.hobbyIds) {
      await memberHobbyRepo.save(
        params.hobbyIds.map((hobbyId) => {
          return { hobbyId, memberId: member.id };
        })
      );
      delete params.hobbyIds;
    }

    await memberDetailRepo.save({ ...params, memberId: member.id });
  });
}

interface ResetPasswordParams {
  phone: string;
  newPassword: string;
  verifiedCode: string;
}
export async function resetPassword({
  phone,
  newPassword,
}: ResetPasswordParams) {
  const memberRepo = getRepository(Member);
  phone = await handlePhoneNumber(phone);

  const member = await getMemberByPhone(phone);
  if (!member) throw ErrorCode.Member_Not_Exist;

  await memberRepo.update(
    { id: member.id },
    {
      password: await hash(newPassword, config.auth.SaltRounds),
    }
  );
}

const getMemberByPhone = async (phone: string) => {
  return getRepository(Member).findOne({ phone });
};
