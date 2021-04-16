"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getMemberOnline = exports.updateGPS = exports.editMyProfile = exports.blockMember = exports.getMyProfile = exports.followMember = exports.getMemberDetailById = exports.searchMember = void 0;
var Member_1 = __importDefault(require("$entities/Member"));
var MemberFollow_1 = __importDefault(require("$entities/MemberFollow"));
var MemberBlock_1 = __importDefault(require("$entities/MemberBlock"));
var _enums_1 = require("$enums");
var typeorm_1 = require("typeorm");
var MemberDetail_1 = __importDefault(require("$entities/MemberDetail"));
var MemberImage_1 = __importDefault(require("$entities/MemberImage"));
var socket_1 = require("$helpers/socket");
var Notification_1 = __importDefault(require("$entities/Notification"));
var oneSignal_1 = require("$helpers/oneSignal");
function searchMember(params) {
    return __awaiter(this, void 0, void 0, function () {
        var memberRepository, memberBlockRepository, queryBuilder, members, listBlocks, memberSearch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    memberRepository = typeorm_1.getRepository(Member_1.default);
                    memberBlockRepository = typeorm_1.getRepository(MemberBlock_1.default);
                    queryBuilder = memberRepository
                        .createQueryBuilder("member")
                        .where("member.status = " + _enums_1.MemberStatus.ACTIVE)
                        .andWhere("member.showLocation = " + _enums_1.ShowLocation.YES)
                        .andWhere("member.id != :memberId", { memberId: params.memberId })
                        .innerJoin("member.memberDetail", "memberDetail")
                        .select([
                        "member.id id",
                        "member.avatar avatar",
                        "memberDetail.name name",
                        "member.lat lat",
                        "member.lng lng",
                        "ST_Distance_Sphere(\n        ST_GeomFromText( CONCAT('POINT(', member.lat, ' ', member.lng, ')'), 4326),\n        ST_GeomFromText('POINT(" + params.lat + " " + params.lng + ")', 4326)\n      ) as distanceGeo",
                    ])
                        .andWhere("ST_Distance_Sphere(\n      ST_GeomFromText( CONCAT('POINT(', member.lat, ' ', member.lng, ')'), 4326),\n      ST_GeomFromText('POINT(" + params.lat + " " + params.lng + ")', 4326)\n    ) <= :distanceSearch", { distanceSearch: params.distanceSearch });
                    if (params.gender) {
                        queryBuilder.andWhere("memberDetail.gender = :gender", {
                            gender: params.gender,
                        });
                    }
                    return [4 /*yield*/, queryBuilder.orderBy("distanceGeo", "ASC").getRawMany()];
                case 1:
                    members = _a.sent();
                    return [4 /*yield*/, memberBlockRepository.find({
                            where: [{ memberId: params.memberId }, { targetId: params.memberId }],
                        })];
                case 2:
                    listBlocks = _a.sent();
                    memberSearch = members.filter(function (member) {
                        var checkBlock = listBlocks.find(function (block) { return block.memberId == member.id || block.targetId == member.id; });
                        if (!checkBlock)
                            return member;
                    });
                    return [2 /*return*/, memberSearch];
            }
        });
    });
}
exports.searchMember = searchMember;
function getMemberDetailById(memberId, targetId) {
    return __awaiter(this, void 0, void 0, function () {
        var memberRepository, memberBlockRepository, memberBlock, member, checkFollow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    memberRepository = typeorm_1.getRepository(Member_1.default);
                    memberBlockRepository = typeorm_1.getRepository(MemberBlock_1.default);
                    return [4 /*yield*/, memberBlockRepository.find({
                            memberId: typeorm_1.In([memberId, targetId]),
                            targetId: typeorm_1.In([memberId, targetId]),
                        })];
                case 1:
                    memberBlock = _a.sent();
                    if (memberBlock.length > 0)
                        throw _enums_1.ErrorCode.Blocked;
                    if (memberId == targetId)
                        throw _enums_1.ErrorCode.Invalid_Input;
                    return [4 /*yield*/, memberRepository
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
                            .leftJoinAndMapMany("member.memberFollowed", "MemberFollow", "memberFollowed", "memberFollowed.targetId = member.id")
                            .where("member.status = " + _enums_1.MemberStatus.ACTIVE)
                            .andWhere("member.id = :targetId", { targetId: targetId })
                            .getOne()];
                case 2:
                    member = _a.sent();
                    checkFollow = member["memberFollowed"].find(function (x) { return x.memberId == memberId; });
                    return [2 /*return*/, __assign(__assign({}, member), { isFollow: checkFollow ? _enums_1.Following.YES : _enums_1.Following.NO, memberFollowed: member["memberFollowed"].length })];
            }
        });
    });
}
exports.getMemberDetailById = getMemberDetailById;
function followMember(memberId, targetId) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, typeorm_1.getConnection().transaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                    var memberRepository, memberFollowRepository, memberBlockRepository, notificationRepository, member, target, memberFollow, checkBlock, checkMemberFollow, notificationObj;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                memberRepository = transaction.getRepository(Member_1.default);
                                memberFollowRepository = transaction.getRepository(MemberFollow_1.default);
                                memberBlockRepository = transaction.getRepository(MemberBlock_1.default);
                                notificationRepository = transaction.getRepository(Notification_1.default);
                                return [4 /*yield*/, memberRepository.findOne({
                                        where: { id: memberId },
                                        relations: ["memberDetail"],
                                    })];
                            case 1:
                                member = _a.sent();
                                return [4 /*yield*/, memberRepository.findOne({
                                        where: { id: targetId },
                                        relations: ["memberDetail"],
                                    })];
                            case 2:
                                target = _a.sent();
                                if (member.status != _enums_1.CommonStatus.ACTIVE)
                                    throw _enums_1.ErrorCode.Member_Blocked;
                                if (memberId == targetId)
                                    throw _enums_1.ErrorCode.You_Can_Not_Follow_Yourself;
                                memberFollow = { memberId: memberId, targetId: targetId };
                                return [4 /*yield*/, memberBlockRepository.findOne({
                                        where: [memberFollow, { memberId: targetId, targetId: memberId }],
                                    })];
                            case 3:
                                checkBlock = _a.sent();
                                if (checkBlock)
                                    throw _enums_1.ErrorCode.Blocked;
                                return [4 /*yield*/, memberFollowRepository.findOne(memberFollow)];
                            case 4:
                                checkMemberFollow = _a.sent();
                                notificationObj = new Notification_1.default();
                                notificationObj.memberId = targetId;
                                notificationObj.redirectId = memberId;
                                notificationObj.redirectType = _enums_1.RedirectType.MEMBER;
                                if (!checkMemberFollow) return [3 /*break*/, 6];
                                return [4 /*yield*/, memberFollowRepository.delete(memberFollow)];
                            case 5:
                                _a.sent();
                                notificationObj.content = member.memberDetail.name + " unfollowed you!";
                                return [3 /*break*/, 8];
                            case 6:
                                if (target.status != _enums_1.CommonStatus.ACTIVE)
                                    throw _enums_1.ErrorCode.Member_Blocked;
                                return [4 /*yield*/, memberFollowRepository.save(memberFollow)];
                            case 7:
                                _a.sent();
                                notificationObj.content = member.memberDetail.name + " followed you!";
                                _a.label = 8;
                            case 8: return [4 /*yield*/, notificationRepository.save(notificationObj)];
                            case 9:
                                _a.sent();
                                return [4 /*yield*/, oneSignal_1.pushNotificationToMember(notificationObj)];
                            case 10:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.followMember = followMember;
function getMyProfile(memberId) {
    return __awaiter(this, void 0, void 0, function () {
        var memberRepository, memberFollowRepository, memberBlockRepository, profile, memberFollowed, memberFollowing, memberBlock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    memberRepository = typeorm_1.getRepository(Member_1.default);
                    memberFollowRepository = typeorm_1.getRepository(MemberFollow_1.default);
                    memberBlockRepository = typeorm_1.getRepository(MemberBlock_1.default);
                    return [4 /*yield*/, memberRepository.findOne({
                            where: { id: memberId },
                            relations: ["memberDetail", "memberImages"],
                        })];
                case 1:
                    profile = _a.sent();
                    return [4 /*yield*/, memberFollowRepository.count({ memberId: memberId })];
                case 2:
                    memberFollowed = _a.sent();
                    return [4 /*yield*/, memberFollowRepository.count({
                            targetId: memberId,
                        })];
                case 3:
                    memberFollowing = _a.sent();
                    return [4 /*yield*/, memberBlockRepository
                            .createQueryBuilder("memberBlock")
                            .select([
                            "member.id memberId",
                            "member.avatar avatar",
                            "memberDetail.name name",
                        ])
                            .leftJoin(Member_1.default, "member", "memberBlock.targetId = member.id")
                            .leftJoin("member.memberDetail", "memberDetail")
                            .where("memberBlock.memberId = :memberId", { memberId: memberId })
                            .getRawMany()];
                case 4:
                    memberBlock = _a.sent();
                    return [2 /*return*/, __assign(__assign({}, profile), { memberFollowed: memberFollowed,
                            memberFollowing: memberFollowing,
                            memberBlock: memberBlock })];
            }
        });
    });
}
exports.getMyProfile = getMyProfile;
function blockMember(memberId, targetId) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, typeorm_1.getConnection().transaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                    var memberBlockRepository, memberFollowRepository, memberBlock, checkFollow, _i, checkFollow_1, follow, memberId_1, targetId_1, checkMemberBlock;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                memberBlockRepository = transaction.getRepository(MemberBlock_1.default);
                                memberFollowRepository = transaction.getRepository(MemberFollow_1.default);
                                if (memberId == targetId)
                                    throw _enums_1.ErrorCode.You_Can_Not_Follow_Yourself;
                                memberBlock = { memberId: memberId, targetId: targetId };
                                return [4 /*yield*/, memberFollowRepository.find({
                                        where: [memberBlock, { memberId: targetId, targetId: memberId }],
                                    })];
                            case 1:
                                checkFollow = _a.sent();
                                _i = 0, checkFollow_1 = checkFollow;
                                _a.label = 2;
                            case 2:
                                if (!(_i < checkFollow_1.length)) return [3 /*break*/, 5];
                                follow = checkFollow_1[_i];
                                memberId_1 = follow.memberId, targetId_1 = follow.targetId;
                                return [4 /*yield*/, memberFollowRepository.delete({ memberId: memberId_1, targetId: targetId_1 })];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4:
                                _i++;
                                return [3 /*break*/, 2];
                            case 5: return [4 /*yield*/, memberBlockRepository.findOne(memberBlock)];
                            case 6:
                                checkMemberBlock = _a.sent();
                                if (!checkMemberBlock) return [3 /*break*/, 8];
                                return [4 /*yield*/, memberBlockRepository.delete(memberBlock)];
                            case 7:
                                _a.sent();
                                return [3 /*break*/, 10];
                            case 8: return [4 /*yield*/, memberBlockRepository.save(memberBlock)];
                            case 9:
                                _a.sent();
                                _a.label = 10;
                            case 10: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.blockMember = blockMember;
function editMyProfile(memberId, params) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, typeorm_1.getConnection().transaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                    var memberRepo, memberDetailRepo, memberImageRepo;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                memberRepo = transaction.getRepository(Member_1.default);
                                memberDetailRepo = transaction.getRepository(MemberDetail_1.default);
                                memberImageRepo = transaction.getRepository(MemberImage_1.default);
                                return [4 /*yield*/, memberRepo.update({ id: memberId }, params)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.editMyProfile = editMyProfile;
function updateGPS(memberId, params) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, typeorm_1.getConnection().transaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                    var memberRepo;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                memberRepo = transaction.getRepository(Member_1.default);
                                return [4 /*yield*/, memberRepo.update({ id: memberId }, params)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.updateGPS = updateGPS;
function getMemberOnline(memberId) {
    return __awaiter(this, void 0, void 0, function () {
        var memberFollowRepository, listMemberFollowed, role, listOnline;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    memberFollowRepository = typeorm_1.getRepository(MemberFollow_1.default);
                    return [4 /*yield*/, memberFollowRepository
                            .createQueryBuilder("memberFollow")
                            .select(["member.id id", "member.avatar avatar", "memberDetail.name name"])
                            .innerJoin("Member", "member", "memberFollow.targetId = member.id")
                            .innerJoin("member.memberDetail", "memberDetail")
                            .where("memberFollow.memberId = :memberId", { memberId: memberId })
                            .andWhere("member.status = " + _enums_1.MemberStatus.ACTIVE)
                            .getRawMany()];
                case 1:
                    listMemberFollowed = _a.sent();
                    role = 1;
                    listOnline = listMemberFollowed.filter(function (memberFollow) {
                        var id = memberFollow.id;
                        if (socket_1.isOnline(id, role))
                            return memberFollow;
                    });
                    return [2 /*return*/, listOnline];
            }
        });
    });
}
exports.getMemberOnline = getMemberOnline;
//# sourceMappingURL=app.member.js.map