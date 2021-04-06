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
exports.getMyProfile = exports.followMember = exports.getMemberDetailById = exports.searchMember = void 0;
var Member_1 = __importDefault(require("$entities/Member"));
var MemberFollow_1 = __importDefault(require("$entities/MemberFollow"));
var MemberBlock_1 = __importDefault(require("$entities/MemberBlock"));
var _enums_1 = require("$enums");
var typeorm_1 = require("typeorm");
function searchMember(params) {
    return __awaiter(this, void 0, void 0, function () {
        var memberRepository, queryBuilder, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    memberRepository = typeorm_1.getRepository(Member_1.default);
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
                    result = _a.sent();
                    return [2 /*return*/, result];
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
        var memberFollowRepository, memberFollow, checkMemberFollow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    memberFollowRepository = typeorm_1.getRepository(MemberFollow_1.default);
                    if (memberId == targetId)
                        throw _enums_1.ErrorCode.You_Can_Not_Follow_Yourself;
                    memberFollow = { memberId: memberId, targetId: targetId };
                    return [4 /*yield*/, memberFollowRepository.findOne(memberFollow)];
                case 1:
                    checkMemberFollow = _a.sent();
                    if (!checkMemberFollow) return [3 /*break*/, 3];
                    return [4 /*yield*/, memberFollowRepository.delete(memberFollow)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, memberFollowRepository.save(memberFollow)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.followMember = followMember;
function getMyProfile(memberId) {
    return __awaiter(this, void 0, void 0, function () {
        var memberRepository;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    memberRepository = typeorm_1.getRepository(Member_1.default);
                    return [4 /*yield*/, memberRepository.findOne({
                            where: { id: memberId },
                            relations: ["memberDetail"],
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getMyProfile = getMyProfile;
//# sourceMappingURL=app.member.js.map