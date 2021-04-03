"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVerifiedCode = exports.createVerifiedCode = exports.createAccessToken = exports.generateToken = exports.getMemberById = void 0;
var typeorm_1 = require("typeorm");
var _enums_1 = require("$enums");
var jsonwebtoken_1 = require("jsonwebtoken");
var lodash_1 = require("lodash");
var util_1 = require("util");
var await_to_js_1 = __importDefault(require("await-to-js"));
var _config_1 = __importDefault(require("$config"));
var VerifiedCode_1 = __importDefault(require("$entities/VerifiedCode"));
var utils_1 = require("$helpers/utils");
var moment_1 = __importDefault(require("moment"));
var Member_1 = __importDefault(require("$entities/Member"));
var verifyAsync = util_1.promisify(jsonwebtoken_1.verify);
function getMemberById(memberId) {
    return __awaiter(this, void 0, void 0, function () {
        var memberRepository, member;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    memberRepository = typeorm_1.getRepository(Member_1.default);
                    return [4 /*yield*/, memberRepository.findOne({ id: memberId })];
                case 1:
                    member = _a.sent();
                    return [2 /*return*/, member];
            }
        });
    });
}
exports.getMemberById = getMemberById;
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
function generateToken(memberId) {
    return __awaiter(this, void 0, void 0, function () {
        var memberRepository, member, dataEncode, token, oldRefreshToken, error, dataEncodeRefreshToken, newRefreshToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    memberRepository = typeorm_1.getRepository(Member_1.default);
                    return [4 /*yield*/, getMemberById(memberId)];
                case 1:
                    member = _a.sent();
                    dataEncode = lodash_1.pick(member, ["id", "status", "phone"]);
                    token = generateAccessToken(dataEncode);
                    oldRefreshToken = member.refreshToken;
                    return [4 /*yield*/, await_to_js_1.default(verifyAsync(oldRefreshToken, _config_1.default.auth.RefreshTokenSecret))];
                case 2:
                    error = (_a.sent())[0];
                    if (!error) return [3 /*break*/, 4];
                    dataEncodeRefreshToken = lodash_1.pick(member, ["id", "status", "phone"]);
                    newRefreshToken = generateRefreshToken(dataEncodeRefreshToken);
                    return [4 /*yield*/, memberRepository.update(memberId, { refreshToken: newRefreshToken })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, { token: token, refreshToken: newRefreshToken }];
                case 4: return [2 /*return*/, { token: token, refreshToken: oldRefreshToken }];
            }
        });
    });
}
exports.generateToken = generateToken;
function createAccessToken(memberId) {
    return __awaiter(this, void 0, void 0, function () {
        var member, dataEncode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMemberById(memberId)];
                case 1:
                    member = _a.sent();
                    dataEncode = lodash_1.pick(member, ["id", "status", "phone"]);
                    return [2 /*return*/, generateAccessToken(dataEncode)];
            }
        });
    });
}
exports.createAccessToken = createAccessToken;
var generateAccessToken = function (dataEncode) {
    return jsonwebtoken_1.sign(dataEncode, _config_1.default.auth.AccessTokenSecret, {
        algorithm: "HS256",
        expiresIn: Number(_config_1.default.auth.AccessTokenExpire),
    });
};
var generateRefreshToken = function (dataEncode) {
    return jsonwebtoken_1.sign(dataEncode, _config_1.default.auth.RefreshTokenSecret, {
        algorithm: "HS256",
        expiresIn: _config_1.default.auth.RefreshTokenExpire,
    });
};
function createVerifiedCode(_a) {
    var phone = _a.phone;
    return __awaiter(this, void 0, void 0, function () {
        var verifiedCodeRepo, verifiedCode;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    verifiedCodeRepo = typeorm_1.getRepository(VerifiedCode_1.default);
                    return [4 /*yield*/, verifiedCodeRepo.findOne({
                            phone: phone,
                            status: _enums_1.VerifiedCodeStatus.UN_USED,
                        })];
                case 1:
                    verifiedCode = _b.sent();
                    if (!verifiedCode) {
                        verifiedCode = new VerifiedCode_1.default();
                    }
                    verifiedCode.phone = phone;
                    verifiedCode.code = utils_1.randomOTP();
                    verifiedCode.status = _enums_1.VerifiedCodeStatus.UN_USED;
                    verifiedCode.verifiedDate = null;
                    verifiedCode.expiredDate = moment_1.default()
                        .add(60 * 20, "seconds")
                        .toDate();
                    return [4 /*yield*/, verifiedCodeRepo.save(verifiedCode)];
                case 2:
                    _b.sent();
                    // TODO: Send verified code to email
                    return [2 /*return*/];
            }
        });
    });
}
exports.createVerifiedCode = createVerifiedCode;
function checkVerifiedCode(_a) {
    var phone = _a.phone, verifiedCode = _a.verifiedCode;
    return __awaiter(this, void 0, void 0, function () {
        var verifiedCodeRepo, _b, id, code, retry;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    verifiedCodeRepo = typeorm_1.getRepository(VerifiedCode_1.default);
                    return [4 /*yield*/, verifiedCodeRepo.findOne({
                            phone: phone,
                            status: _enums_1.VerifiedCodeStatus.UN_USED,
                            expiredDate: typeorm_1.MoreThan(new Date()),
                        })];
                case 1:
                    _b = _c.sent(), id = _b.id, code = _b.code, retry = _b.retry;
                    if (retry > 5)
                        throw _enums_1.ErrorCode.Verified_Code_Max_Try;
                    if (!(code !== verifiedCode)) return [3 /*break*/, 3];
                    return [4 /*yield*/, verifiedCodeRepo.update({ id: id }, { retry: function () { return "`retry` + 1"; } })];
                case 2:
                    _c.sent();
                    throw _enums_1.ErrorCode.Verified_Code_Invalid;
                case 3: return [2 /*return*/, {
                        isValid: Boolean(code),
                    }];
            }
        });
    });
}
exports.checkVerifiedCode = checkVerifiedCode;
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
//# sourceMappingURL=app.auth.js.map