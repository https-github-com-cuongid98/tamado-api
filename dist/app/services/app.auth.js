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
exports.resetPassword = exports.register = exports.checkVerifiedCode = exports.createVerifiedCode = exports.checkEmailExisted = exports.createAccessToken = exports.generateToken = exports.changePassword = exports.login = exports.getMemberByEmail = exports.getMemberById = void 0;
var typeorm_1 = require("typeorm");
var _enums_1 = require("$enums");
var bcryptjs_1 = require("bcryptjs");
var Member_1 = __importDefault(require("$entities/Member"));
var jsonwebtoken_1 = require("jsonwebtoken");
var lodash_1 = require("lodash");
var util_1 = require("util");
var await_to_js_1 = __importDefault(require("await-to-js"));
var _config_1 = __importDefault(require("$config"));
var VerifiedCode_1 = __importDefault(require("$entities/VerifiedCode"));
var utils_1 = require("$helpers/utils");
var moment_1 = __importDefault(require("moment"));
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
function getMemberByEmail(email) {
    return __awaiter(this, void 0, void 0, function () {
        var memberRepository, member;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    memberRepository = typeorm_1.getRepository(Member_1.default);
                    return [4 /*yield*/, memberRepository.findOne({ email: email })];
                case 1:
                    member = _a.sent();
                    return [2 /*return*/, member];
            }
        });
    });
}
exports.getMemberByEmail = getMemberByEmail;
function login(params) {
    return __awaiter(this, void 0, void 0, function () {
        var memberRepository, email, password, member, isTruePassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    memberRepository = typeorm_1.getRepository(Member_1.default);
                    email = params.email, password = params.password;
                    return [4 /*yield*/, memberRepository.findOne({ email: email })];
                case 1:
                    member = _a.sent();
                    if (!member)
                        throw _enums_1.ErrorCode.Email_Or_Password_Invalid;
                    if (member.status !== _enums_1.MemberStatus.ACTIVE)
                        throw _enums_1.ErrorCode.Member_Blocked;
                    return [4 /*yield*/, bcryptjs_1.compare(password, member.password)];
                case 2:
                    isTruePassword = _a.sent();
                    if (!isTruePassword)
                        throw _enums_1.ErrorCode.Email_Or_Password_Invalid;
                    return [2 /*return*/, generateToken(member.id)];
            }
        });
    });
}
exports.login = login;
function changePassword(memberId, params) {
    return __awaiter(this, void 0, void 0, function () {
        var repoMember, oldPassword, newPassword, member, isTruePassword, passwordHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    repoMember = typeorm_1.getRepository(Member_1.default);
                    oldPassword = params.oldPassword, newPassword = params.newPassword;
                    if (oldPassword === newPassword)
                        throw _enums_1.ErrorCode.Invalid_Input;
                    return [4 /*yield*/, repoMember.findOne(memberId, { select: ['password'] })];
                case 1:
                    member = _a.sent();
                    if (!member)
                        throw _enums_1.ErrorCode.Member_Not_Exist;
                    return [4 /*yield*/, bcryptjs_1.compare(oldPassword, member.password)];
                case 2:
                    isTruePassword = _a.sent();
                    if (!isTruePassword)
                        throw _enums_1.ErrorCode.Password_Invalid;
                    return [4 /*yield*/, bcryptjs_1.hash(newPassword, _config_1.default.auth.SaltRounds)];
                case 3:
                    passwordHash = _a.sent();
                    return [4 /*yield*/, repoMember.update(memberId, { password: passwordHash })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.changePassword = changePassword;
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
                    dataEncode = lodash_1.pick(member, ['id', 'status', 'email', 'mobile']);
                    token = generateAccessToken(dataEncode);
                    oldRefreshToken = member.refreshToken;
                    return [4 /*yield*/, await_to_js_1.default(verifyAsync(oldRefreshToken, _config_1.default.auth.RefreshTokenSecret))];
                case 2:
                    error = (_a.sent())[0];
                    if (!error) return [3 /*break*/, 4];
                    dataEncodeRefreshToken = lodash_1.pick(member, ['id', 'status', 'email', 'mobile']);
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
                    dataEncode = lodash_1.pick(member, ['id', 'status', 'email', 'mobile', 'permissions']);
                    return [2 /*return*/, generateAccessToken(dataEncode)];
            }
        });
    });
}
exports.createAccessToken = createAccessToken;
var generateAccessToken = function (dataEncode) {
    return jsonwebtoken_1.sign(dataEncode, _config_1.default.auth.AccessTokenSecret, {
        algorithm: 'HS256',
        expiresIn: Number(_config_1.default.auth.AccessTokenExpire),
    });
};
var generateRefreshToken = function (dataEncode) {
    return jsonwebtoken_1.sign(dataEncode, _config_1.default.auth.RefreshTokenSecret, {
        algorithm: 'HS256',
        expiresIn: _config_1.default.auth.RefreshTokenExpire,
    });
};
function checkEmailExisted(email) {
    return __awaiter(this, void 0, void 0, function () {
        var member;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMemberByEmail(email)];
                case 1:
                    member = _a.sent();
                    return [2 /*return*/, { isExisted: !!member }];
            }
        });
    });
}
exports.checkEmailExisted = checkEmailExisted;
function createVerifiedCode(_a) {
    var email = _a.email;
    return __awaiter(this, void 0, void 0, function () {
        var verifiedCodeRepo, verifiedCode;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    verifiedCodeRepo = typeorm_1.getRepository(VerifiedCode_1.default);
                    return [4 /*yield*/, verifiedCodeRepo.findOne({ target: email })];
                case 1:
                    verifiedCode = _b.sent();
                    if (!verifiedCode) {
                        verifiedCode = new VerifiedCode_1.default();
                    }
                    verifiedCode.target = email;
                    verifiedCode.code = utils_1.randomOTP();
                    verifiedCode.status = _enums_1.VerifiedCodeStatus.UNUSED;
                    verifiedCode.verifiedDate = null;
                    verifiedCode.expiredDate = moment_1.default()
                        .add(60 * 20, 'seconds')
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
    var email = _a.email, verifiedCode = _a.verifiedCode;
    return __awaiter(this, void 0, void 0, function () {
        var verifiedCodeRepo, code;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    verifiedCodeRepo = typeorm_1.getRepository(VerifiedCode_1.default);
                    return [4 /*yield*/, verifiedCodeRepo.findOne({
                            target: email,
                            code: verifiedCode,
                            status: _enums_1.VerifiedCodeStatus.UNUSED,
                            expiredDate: typeorm_1.MoreThan(new Date()),
                        })];
                case 1:
                    code = _b.sent();
                    return [2 /*return*/, {
                            isValid: Boolean(code),
                        }];
            }
        });
    });
}
exports.checkVerifiedCode = checkVerifiedCode;
function register(_a) {
    var _b;
    var email = _a.email, password = _a.password, verifiedCode = _a.verifiedCode;
    return __awaiter(this, void 0, void 0, function () {
        var isVerifiedCodeValid, existedMember, member;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, checkVerifiedCode({ email: email, verifiedCode: verifiedCode })];
                case 1:
                    isVerifiedCodeValid = (_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.isValid;
                    if (!isVerifiedCodeValid)
                        throw _enums_1.ErrorCode.Verified_Code_Invalid;
                    return [4 /*yield*/, getMemberByEmail(email)];
                case 2:
                    existedMember = _c.sent();
                    if (existedMember)
                        throw _enums_1.ErrorCode.Email_Existed;
                    return [4 /*yield*/, typeorm_1.getConnection().transaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                            var memberRepo, verifiedCodeRepo, member, _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        memberRepo = transaction.getRepository(Member_1.default);
                                        verifiedCodeRepo = transaction.getRepository(VerifiedCode_1.default);
                                        _b = (_a = memberRepo).save;
                                        _c = {
                                            email: email
                                        };
                                        return [4 /*yield*/, bcryptjs_1.hash(password, _config_1.default.auth.SaltRounds)];
                                    case 1: return [4 /*yield*/, _b.apply(_a, [(_c.password = _d.sent(),
                                                _c)])];
                                    case 2:
                                        member = _d.sent();
                                        return [4 /*yield*/, verifiedCodeRepo.update({ target: email }, { status: _enums_1.VerifiedCodeStatus.USED, verifiedDate: new Date() })];
                                    case 3:
                                        _d.sent();
                                        return [2 /*return*/, member];
                                }
                            });
                        }); })];
                case 3:
                    member = _c.sent();
                    return [4 /*yield*/, generateToken(member.id)];
                case 4: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
exports.register = register;
function resetPassword(_a) {
    var _b;
    var email = _a.email, newPassword = _a.newPassword, verifiedCode = _a.verifiedCode;
    return __awaiter(this, void 0, void 0, function () {
        var isVerifiedCodeValid, member;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, checkVerifiedCode({ email: email, verifiedCode: verifiedCode })];
                case 1:
                    isVerifiedCodeValid = (_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.isValid;
                    if (!isVerifiedCodeValid)
                        throw _enums_1.ErrorCode.Verified_Code_Invalid;
                    return [4 /*yield*/, getMemberByEmail(email)];
                case 2:
                    member = _c.sent();
                    if (!member)
                        throw _enums_1.ErrorCode.Email_Not_Exist;
                    return [4 /*yield*/, typeorm_1.getConnection().transaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                            var memberRepo, verifiedCodeRepo, _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        memberRepo = transaction.getRepository(Member_1.default);
                                        verifiedCodeRepo = transaction.getRepository(VerifiedCode_1.default);
                                        _b = (_a = memberRepo).update;
                                        _c = [{ email: email }];
                                        _d = {};
                                        return [4 /*yield*/, bcryptjs_1.hash(newPassword, _config_1.default.auth.SaltRounds)];
                                    case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([(_d.password = _e.sent(),
                                                _d)]))];
                                    case 2:
                                        _e.sent();
                                        return [4 /*yield*/, verifiedCodeRepo.update({ target: email }, { status: _enums_1.VerifiedCodeStatus.USED, verifiedDate: new Date() })];
                                    case 3:
                                        _e.sent();
                                        return [2 /*return*/, member];
                                }
                            });
                        }); })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, generateToken(member.id)];
                case 4: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
exports.resetPassword = resetPassword;
//# sourceMappingURL=app.auth.js.map