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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListConversationByMemberId = exports.saveMessage = exports.updateReadMessageState = exports.sendMassage = exports.getOrCreateConversation = exports.getListMassageInConversation = void 0;
var Conversation_1 = __importDefault(require("$entities/Conversation"));
var ConversationMember_1 = __importDefault(require("$entities/ConversationMember"));
var MemberBlock_1 = __importDefault(require("$entities/MemberBlock"));
var Message_1 = __importDefault(require("$entities/Message"));
var _enums_1 = require("$enums");
var socket_1 = require("$helpers/socket");
var utils_1 = require("$helpers/utils");
var lodash_1 = require("lodash");
var typeorm_1 = require("typeorm");
function getListMassageInConversation(memberId, conversationId, params) {
    return __awaiter(this, void 0, void 0, function () {
        var conversationRepo, memberBlockRepo, conversationMemberRepository, conversation, conversationMember, target, checkBlock, query, member, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    conversationRepo = typeorm_1.getRepository(Conversation_1.default);
                    memberBlockRepo = typeorm_1.getRepository(MemberBlock_1.default);
                    conversationMemberRepository = typeorm_1.getRepository(ConversationMember_1.default);
                    if (!conversationId)
                        throw _enums_1.ErrorCode.Invalid_Input;
                    return [4 /*yield*/, conversationRepo
                            .createQueryBuilder("conversation")
                            .where("conversation.id = :conversationId", {
                            conversationId: conversationId,
                        })
                            .innerJoin("conversation.conversationMember", "conversationMember")
                            .addSelect(["conversationMember.memberId"])
                            .getOne()];
                case 1:
                    conversation = _a.sent();
                    if (!conversation)
                        throw _enums_1.ErrorCode.Conversation_Not_Exist;
                    conversationMember = conversation.conversationMember.find(function (member) { return member.memberId == memberId; });
                    if (!conversationMember)
                        throw _enums_1.ErrorCode.You_Not_Member_In_This_Conversation;
                    target = conversation.conversationMember.find(function (member) { return member.memberId != memberId; });
                    return [4 /*yield*/, memberBlockRepo.findOne({
                            where: [
                                { memberId: memberId, targetId: target.memberId },
                                { memberId: target.memberId, targetId: memberId },
                            ],
                        })];
                case 2:
                    checkBlock = _a.sent();
                    if (checkBlock)
                        throw _enums_1.ErrorCode.Blocked;
                    query = Message_1.default.find();
                    query
                        .where("conversationId")
                        .equals(conversationId)
                        .where("status")
                        .equals(_enums_1.CommonStatus.ACTIVE);
                    if (params.takeAfter) {
                        query.where("createdAt").lt(params.takeAfter);
                        delete params.isRead;
                    }
                    if (!(params.isRead === _enums_1.IsRead.UN_SEEN)) return [3 /*break*/, 4];
                    return [4 /*yield*/, conversationMemberRepository.findOne({
                            memberId: memberId,
                            conversationId: params.conversationId,
                        })];
                case 3:
                    member = _a.sent();
                    query.where("createdAt").gt(member.lastReadTime);
                    _a.label = 4;
                case 4:
                    query
                        .select("_id memberId conversationId body metadata image status messageType createdAt memberType")
                        .limit(params.take)
                        .sort("-createdAt");
                    return [4 /*yield*/, query.lean()];
                case 5:
                    data = _a.sent();
                    return [4 /*yield*/, conversationMemberRepository.update({
                            conversationId: params.conversationId,
                            memberId: memberId,
                            memberType: _enums_1.MemberType.APP,
                        }, { isRead: _enums_1.IsRead.SEEN, lastReadTime: new Date().getTime() })];
                case 6:
                    _a.sent();
                    return [2 /*return*/, utils_1.returnPaging(data, null, params)];
            }
        });
    });
}
exports.getListMassageInConversation = getListMassageInConversation;
function getOrCreateConversation(memberId, params) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (memberId == params.targetId)
                throw _enums_1.ErrorCode.Invalid_Input;
            return [2 /*return*/, typeorm_1.getConnection().transaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                    var conversationRepo, conversationMemberRepo, memberBlockRepo, checkBlock, conversationMember, checkConversationMember, conversation, members;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                conversationRepo = transaction.getRepository(Conversation_1.default);
                                conversationMemberRepo = transaction.getRepository(ConversationMember_1.default);
                                memberBlockRepo = transaction.getRepository(MemberBlock_1.default);
                                return [4 /*yield*/, memberBlockRepo.findOne({
                                        where: [
                                            { memberId: memberId, targetId: params.targetId },
                                            { memberId: params.targetId, targetId: memberId },
                                        ],
                                    })];
                            case 1:
                                checkBlock = _a.sent();
                                if (checkBlock)
                                    throw _enums_1.ErrorCode.Blocked;
                                conversationMember = [{ memberId: memberId }, { memberId: params.targetId }];
                                return [4 /*yield*/, conversationMemberRepo.find({
                                        where: conversationMember,
                                    })];
                            case 2:
                                checkConversationMember = _a.sent();
                                if (checkConversationMember.length == 2) {
                                    return [2 /*return*/, { conversationId: checkConversationMember[0].conversationId }];
                                }
                                return [4 /*yield*/, conversationRepo.save({
                                        conversationType: _enums_1.ConversationType.PERSON,
                                    })];
                            case 3:
                                conversation = _a.sent();
                                members = [
                                    { memberId: memberId, memberType: _enums_1.MemberType.APP, conversationId: conversation.id },
                                    {
                                        memberId: params.targetId,
                                        memberType: _enums_1.MemberType.APP,
                                        conversationId: conversation.id,
                                    },
                                ];
                                return [4 /*yield*/, conversationMemberRepo.insert(members)];
                            case 4:
                                _a.sent();
                                return [2 /*return*/, { conversationId: conversation.id }];
                        }
                    });
                }); })];
        });
    });
}
exports.getOrCreateConversation = getOrCreateConversation;
function sendMassage(memberId, params) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, typeorm_1.getConnection().transaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                        var conversationRepository, conversationMemberRepository, conversation, membersInConversation, isMember, memberOnlineInConversation, membersUpdated, messageObj, message;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    conversationRepository = transaction.getRepository(Conversation_1.default);
                                    conversationMemberRepository = transaction.getRepository(ConversationMember_1.default);
                                    return [4 /*yield*/, conversationRepository.findOne({
                                            where: { id: params.conversationId },
                                        })];
                                case 1:
                                    conversation = _a.sent();
                                    if (!conversation)
                                        throw _enums_1.ErrorCode.Not_Found;
                                    return [4 /*yield*/, conversationMemberRepository.find({
                                            conversationId: params.conversationId,
                                        })];
                                case 2:
                                    membersInConversation = _a.sent();
                                    isMember = membersInConversation.find(function (member) { return member.memberId == memberId; });
                                    if (!isMember)
                                        _enums_1.ErrorCode.You_Not_Member_In_This_Conversation;
                                    return [4 /*yield*/, conversationRepository.update({ id: params.conversationId }, {
                                            lastMessage: params.content,
                                            lastMessageType: params.messageType,
                                            lastSentMemberId: memberId,
                                            lastTimeSent: new Date().toISOString(),
                                        })];
                                case 3:
                                    _a.sent();
                                    memberOnlineInConversation = socket_1.getMembersOnlineInConversation(params.conversationId);
                                    memberOnlineInConversation = lodash_1.unionWith(memberOnlineInConversation, [
                                        {
                                            memberId: memberId,
                                            memberType: _enums_1.MemberType.APP,
                                            conversationId: params.conversationId,
                                        },
                                    ]);
                                    return [4 /*yield*/, updateReadMessageState(conversationMemberRepository, membersInConversation, memberOnlineInConversation, new Date().getTime())];
                                case 4:
                                    membersUpdated = _a.sent();
                                    messageObj = {
                                        content: params.content,
                                        image: params === null || params === void 0 ? void 0 : params.image,
                                        metadata: params.metadata,
                                        memberId: memberId,
                                        messageType: params.messageType,
                                        memberType: _enums_1.MemberType.APP,
                                        conversationId: params.conversationId,
                                        createdAt: new Date().getTime(),
                                    };
                                    utils_1.assignThumbUrl(messageObj, "image");
                                    return [4 /*yield*/, saveMessage(messageObj)];
                                case 5:
                                    message = _a.sent();
                                    Object.assign(messageObj, {
                                        _id: message["_id"],
                                        status: message["status"],
                                    });
                                    // const memberNotFocusConversation = differenceBy(members, membersOnline, 'memberId');
                                    // const target = members.find(
                                    //   (item) => (item.memberId !== memberId && item.memberType === MemberType.APP) || item.memberType !== MemberType.APP
                                    // );
                                    // const isNotFocusTab = memberNotFocusConversation.some(
                                    //   (item) =>
                                    //     (item.memberId === target.memberId && item.memberType !== MemberType.ADMIN) ||
                                    //     item.memberType === MemberType.ADMIN
                                    // );
                                    // const notificationObj: INotificationObj = {
                                    //   type: NotificationType.MESSAGE,
                                    //   memberId: target.memberId,
                                    //   memberType: target.memberType,
                                    //   creatorId: memberId,
                                    //   imageURL: image,
                                    //   name: member.name,
                                    //   icon: member.avatarURL,
                                    //   title: member.name,
                                    //   objectId: conversationId,
                                    //   objectName: null,
                                    //   content: lastMessage,
                                    //   redirectId: conversationId,
                                    //   redirectType: RedirectType.CONVERSATION,
                                    //   messageId: String(message['_id']),
                                    //   currentUnix,
                                    // };
                                    // if (isNotFocusTab && target.memberType === MemberType.APP) {
                                    //   await PushMessageNotificationQueue.add(
                                    //     KeyQueue.PUSH_NOTIFICATION_MESSAGE,
                                    //     { notificationObj, memberIds: [target.memberId] },
                                    //     { delay: config.delayNotification }
                                    //   );
                                    // }
                                    socket_1.pushSocketMessage(membersUpdated, {
                                        id: params.conversationId,
                                        lastMessage: params.lastMessage || params.content,
                                        lastTimeSent: new Date().toISOString(),
                                        lastReadTime: new Date().getTime(),
                                        lastSentMemberId: memberId,
                                        lastMessageType: params.messageType,
                                    }, messageObj);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.sendMassage = sendMassage;
function updateReadMessageState(conversationMemberRepository, members, membersOnlineInConversation, lastReadTime) {
    return __awaiter(this, void 0, void 0, function () {
        var updateReadState;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    members = members.map(function (item) {
                        item.isRead = Number(membersOnlineInConversation.some(function (el) {
                            return el.memberId === item.memberId && item.memberType === el.memberType;
                        }));
                        item.lastReadTime = item.isRead ? lastReadTime : item.lastReadTime;
                        return item;
                    });
                    updateReadState = members.map(function (_a) {
                        var isRead = _a.isRead, lastReadTime = _a.lastReadTime, item = __rest(_a, ["isRead", "lastReadTime"]);
                        return conversationMemberRepository.update(item, { lastReadTime: lastReadTime, isRead: isRead });
                    });
                    return [4 /*yield*/, Promise.all(updateReadState)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, members];
            }
        });
    });
}
exports.updateReadMessageState = updateReadMessageState;
function saveMessage(params) {
    return __awaiter(this, void 0, void 0, function () {
        var saveMessage, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    saveMessage = new Message_1.default();
                    Object.assign(saveMessage, params);
                    return [4 /*yield*/, saveMessage.save()];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.toObject()];
            }
        });
    });
}
exports.saveMessage = saveMessage;
function getListConversationByMemberId(memberId, params) {
    return __awaiter(this, void 0, void 0, function () {
        var conversationRepo, conversationMemberRepo, conversationMembers, conversationIds, queryBuilder, totalItems, conversations;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    conversationRepo = typeorm_1.getRepository(Conversation_1.default);
                    conversationMemberRepo = typeorm_1.getRepository(ConversationMember_1.default);
                    return [4 /*yield*/, conversationMemberRepo.find({ memberId: memberId })];
                case 1:
                    conversationMembers = _a.sent();
                    conversationIds = conversationMembers.map(function (conversationMember) { return conversationMember.conversationId; });
                    queryBuilder = conversationRepo
                        .createQueryBuilder("conversation")
                        .leftJoin("conversation.conversationMember", "conversationMember", "conversationMember.memberId != :memberId", { memberId: memberId })
                        .select([
                        "conversation.id conversationId",
                        "conversationMember.memberId memberId",
                        "conversationMember.memberType memberType",
                        "conversationMember.isRead isRead",
                        "conversationMember.lastReadTime lastReadTime",
                        "memberDetail.name memberName",
                        "member.avatar memberAvatar",
                        "conversation.lastMessage lastMessage",
                        "conversation.lastMessageType lastMessageType",
                        "conversation.lastSentMemberId lastSentMemberId",
                        "conversation.lastTimeSent lastTimeSent",
                    ])
                        .leftJoin("Member", "member", "conversationMember.memberId = member.id")
                        .leftJoin("member.memberDetail", "memberDetail");
                    return [4 /*yield*/, queryBuilder.getCount()];
                case 2:
                    totalItems = _a.sent();
                    return [4 /*yield*/, queryBuilder
                            .limit(params.take)
                            .offset(params.skip)
                            .getRawMany()];
                case 3:
                    conversations = _a.sent();
                    return [2 /*return*/, utils_1.returnPaging(conversations, totalItems, params)];
            }
        });
    });
}
exports.getListConversationByMemberId = getListConversationByMemberId;
//# sourceMappingURL=app.conversation.js.map