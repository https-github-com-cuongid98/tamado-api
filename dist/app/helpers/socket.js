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
exports.endTyping = exports.startTyping = exports.kickMemberOutSocketRoom = exports.emitReadMessage = exports.leaveAllConversations = exports.getMembersOnlineInConversation = exports.memberOnlineInConversation = exports.pushSocketMessage = exports.leaveSocketRoom = exports.joinRoomConversation = exports.emitToSpecificClient = exports.isOnline = void 0;
var socketio_jwt_1 = __importDefault(require("socketio-jwt"));
var _config_1 = __importDefault(require("$config"));
var log_1 = __importDefault(require("$helpers/log"));
var socket_io_1 = __importDefault(require("socket.io"));
var _enums_1 = require("$enums");
// import { assignThumbURL } from './utils';
// import { saveMessage } from '$services/app.conversation';
var logger = log_1.default("Socket utils");
var MemberType;
(function (MemberType) {
    MemberType[MemberType["APP"] = 1] = "APP";
})(MemberType || (MemberType = {}));
var MessageType;
(function (MessageType) {
    MessageType[MessageType["TEXT"] = 1] = "TEXT";
    MessageType[MessageType["IMAGE"] = 2] = "IMAGE";
    MessageType[MessageType["OFFER"] = 3] = "OFFER";
})(MessageType || (MessageType = {}));
var IsReadMessage;
(function (IsReadMessage) {
    IsReadMessage[IsReadMessage["READ"] = 1] = "READ";
    IsReadMessage[IsReadMessage["UNREAD"] = 2] = "UNREAD";
})(IsReadMessage || (IsReadMessage = {}));
var io;
var online = [];
function initSocket(http) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            try {
                if (!io) {
                    io = socket_io_1.default(http, { pingInterval: 2000, pingTimeout: 1000 });
                    logger.info("Socket server is running...");
                }
                io.on("connection", socketAuthorize).on("authenticated", function (client) { return __awaiter(_this, void 0, void 0, function () {
                    var dataDecode, role, id;
                    return __generator(this, function (_a) {
                        client.removeAllListeners();
                        dataDecode = client.decoded_token;
                        role = client.role;
                        id = dataDecode.id;
                        switch (role) {
                            case MemberType.APP:
                                handleAppSocket(client);
                                break;
                            default:
                                break;
                        }
                        handleOnline(id, role, client.id);
                        joinRoomConversation(client, id);
                        startTyping(client, id);
                        endTyping(client, id);
                        leaveSocketRoom(client, id);
                        client.on("disconnect", function () {
                            handleOffline(client, id, role);
                            console.log("Client id: " + client.id + " disconnected");
                        });
                        return [2 /*return*/];
                    });
                }); });
            }
            catch (error) {
                logger.error(error);
            }
            return [2 /*return*/];
        });
    });
}
exports.default = initSocket;
// Xử lí authentication của socket theo từng role
var socketAuthorize = function (socket) {
    var timeout = 86400000; // 1 day to send the authentication message
    var secret;
    var role = socket.handshake.query.role;
    // socket connect http://localhost:3000?role=app
    if (role === "app") {
        socket.role = MemberType.APP;
        secret = _config_1.default.auth.AccessTokenSecret;
    }
    var middle = socketio_jwt_1.default.authorize({ secret: secret, timeout: timeout });
    return middle(socket);
};
function handleAppSocket(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("[App] client connected. Socket id: " + client.id);
            return [2 /*return*/];
        });
    });
}
/**
 * Xử lí online của member kết nối đến socket.
 * Tồn tại trong mảng này rồi thì thêm id vào mảng sokets
 * Chưa tồn tại thì thêm vào mảng.
 * @param id Id của client Cms hoặc app
 * @param role Vai trò là admin, app
 * @param socketId id socket của client
 */
function handleOnline(id, role, socketId) {
    var client = online.find(function (item) { return item.id === id && item.role === role; });
    if (client) {
        var isExist = client.sockets.includes(socketId);
        if (!isExist)
            client.sockets.push(socketId);
    }
    else
        online.push({ id: id, role: role, sockets: [socketId], conversations: [] });
}
/**
 * Xử lí offline của member kết nối đến socket.
 * Mảng sockets dài hơn 1 thì bỏ bớt đi, bằng một thì bỏ luôn clien này khỏi mảng
 * @param id Id của client Cms hoặc app
 * @param role Vai trò là admin, app
 * @param socketId id socket của client
 */
function handleOffline(client, id, role) {
    var position;
    var member = online.find(function (item, index) {
        if (item.id === id && item.role === role)
            position = index;
        return item.id === id && item.role === role;
    });
    if (member && member.sockets.length <= 1)
        online.splice(position, 1);
    if (member && member.sockets.length > 1) {
        member.sockets = member.sockets.filter(function (item) { return item !== client.id; });
        // loại socket này ra khỏi list conversation(nếu có)
        member.conversations = member.conversations.filter(function (item) { return item.socketId !== client.id; });
    }
}
/**
 * Kiểm tra trạng thái online của một client.
 * @param id salon_id, member_id hoặc user_id
 * @param role vai trò của client socket.
 */
function isOnline(id, role) {
    return online.some(function (item) { return item.id === id && item.role === role; });
}
exports.isOnline = isOnline;
/**
 * Lấy một client đang online từ danh sách online
 * @param id salon_id, member_id hoặc user_id
 * @param role vai trò của client socket.
 */
function getSpecificClientOnline(id, role) {
    return online.find(function (item) { return item.id === id && item.role === role; });
}
/**
 * Bắn socket đến một id & role cụ thể nào đó.
 * @param event sự kiện client lắng nghe.
 * @param data dữ liệu muốn gửi đi.
 */
function emitToSpecificClient(id, role, event, data) {
    return __awaiter(this, void 0, void 0, function () {
        var client, _i, _a, item;
        return __generator(this, function (_b) {
            client = getSpecificClientOnline(id, role);
            if (!client)
                return [2 /*return*/];
            if (client.sockets.length === 0)
                return [2 /*return*/];
            for (_i = 0, _a = client.sockets; _i < _a.length; _i++) {
                item = _a[_i];
                io.to(item).emit(event, data);
            }
            return [2 /*return*/];
        });
    });
}
exports.emitToSpecificClient = emitToSpecificClient;
/**
 * Xử lí cho một client join vào room conversation.
 * @param client client
 */
function joinRoomConversation(client, memberId) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            client.on(_enums_1.EventSocket.JOIN_ROOM, function (_a) {
                var conversationId = _a.conversationId;
                return __awaiter(_this, void 0, void 0, function () {
                    var member;
                    return __generator(this, function (_b) {
                        conversationId = Number(conversationId);
                        if (!conversationId)
                            return [2 /*return*/];
                        leaveAllConversations(client);
                        client.join("conversation_" + conversationId);
                        member = online.find(function (member) { return member.id === memberId && member.role === client.role; });
                        if (member) {
                            member.conversations = member.conversations.filter(function (item) { return item.socketId !== client.id; });
                            member.conversations.push({
                                socketId: client.id,
                                room: "conversation_" + conversationId,
                            });
                        }
                        console.log(MemberType[client.role] + " " + memberId + " joined conversation " + conversationId);
                        return [2 /*return*/];
                    });
                });
            });
            client.on("joinAdminConversation", function () {
                client.join("conversation_admin_" + memberId);
                var member = online.find(function (member) { return member.id === memberId && member.role === client.role; });
                if (member) {
                    member.conversations = member.conversations.filter(function (item) { return item.socketId !== client.id; });
                    member.conversations.push({
                        socketId: client.id,
                        room: "conversation_admin_" + memberId,
                    });
                    console.log(MemberType[client.role] + " " + memberId + " joined conversation admin " + memberId);
                }
            });
            return [2 /*return*/];
        });
    });
}
exports.joinRoomConversation = joinRoomConversation;
/**
 * Xử lí rời ra khỏi conversation.
 * @param client socket client
 * @param memberId id của member tùy vào role: admin, salon hoặc app
 */
function leaveSocketRoom(client, memberId) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            client.on(_enums_1.EventSocket.LEAVE_ROOM, function (_a) {
                var conversationId = _a.conversationId;
                return __awaiter(_this, void 0, void 0, function () {
                    var member;
                    return __generator(this, function (_b) {
                        conversationId = Number(conversationId);
                        if (!conversationId)
                            return [2 /*return*/];
                        client.leave("conversation_" + conversationId);
                        member = online.find(function (member) { return member.id === memberId && member.role === client.role; });
                        if (member)
                            member.conversations = member.conversations.filter(function (item) { return item.socketId !== client.id; });
                        console.log("[" + MemberType[client.role] + "] " + memberId + " leaved conversation " + conversationId);
                        return [2 /*return*/];
                    });
                });
            });
            return [2 /*return*/];
        });
    });
}
exports.leaveSocketRoom = leaveSocketRoom;
/**
 * Push message to clients by socket
 */
function pushSocketMessage(members, conversationObj, messageObj) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, members_1, member, role;
        return __generator(this, function (_a) {
            for (_i = 0, members_1 = members; _i < members_1.length; _i++) {
                member = members_1[_i];
                role = member.memberType;
                Object.assign(conversationObj, { isRead: member.isRead });
                emitToSpecificClient(member.memberId, role, _enums_1.EventSocket.CONVERSATIONS, conversationObj);
            }
            io.in("conversation_" + messageObj.conversationId).emit(_enums_1.EventSocket.MESSAGES, messageObj);
            if ([MessageType.IMAGE, MessageType.TEXT].includes(messageObj.messageType)) {
                setTimeout(function () {
                    var data = members.filter(function (item) { return item.isRead === IsReadMessage.READ; });
                    io.in("conversation_" + messageObj.conversationId).emit(_enums_1.EventSocket.READ_MESSAGE, data);
                }, 500);
            }
            return [2 /*return*/];
        });
    });
}
exports.pushSocketMessage = pushSocketMessage;
/**
 * Hàm này dùng để kiểm tra xem đối phương có đang nằm trong conversation này không.
 * => Mục đích để xử lí logic đọc tin nhắn.
 * @param memberId Id của member
 * @param memberType Member thuộc loại nào
 * @param conversationId cuộc trò chuyện muốn kiểm tra
 */
function memberOnlineInConversation(conversationId, memberId, memberType) {
    var member = online.find(function (member) { return member.id === memberId && member.role === memberType; });
    if (!member)
        return;
    var isIn = member.conversations.some(function (item) { return item.room === "conversation_" + conversationId; });
    return isIn;
}
exports.memberOnlineInConversation = memberOnlineInConversation;
/**
 * Lấy ra những member đang online trong cuộc trò chuyện(đang join trong room)
 * Đẩy vào mảng, hàm này dùng nhằm mục đích update trạng thái đã đọc hay chưa đọc của conversation.
 * @param conversationId
 */
function getMembersOnlineInConversation(conversationId) {
    return online.reduce(function (acc, cur) {
        var isInCVS = cur.conversations.some(function (item) { return item.room === "conversation_" + conversationId; });
        if (isInCVS)
            acc.push({ memberId: cur.id, memberType: cur.role, conversationId: conversationId });
        return acc;
    }, []);
}
exports.getMembersOnlineInConversation = getMembersOnlineInConversation;
function leaveAllConversations(client) {
    var rooms = Object.keys(client.adapter.rooms);
    for (var _i = 0, rooms_1 = rooms; _i < rooms_1.length; _i++) {
        var item = rooms_1[_i];
        if (item.startsWith("conversation_")) {
            client.leave(item);
        }
    }
    var member = online.find(function (member) {
        return member.id === client.decoded_token.id && member.role === client.role;
    });
    if (member)
        member.conversations = member.conversations.filter(function (item) { return item.socketId !== client.id; });
}
exports.leaveAllConversations = leaveAllConversations;
function emitReadMessage(memberId, memberType, conversationId) {
    io.in("conversation_" + conversationId).emit(_enums_1.EventSocket.READ_MESSAGE, [
        {
            memberId: memberId,
            memberType: memberType,
            conversationId: conversationId,
            isRead: IsReadMessage.READ,
            lastReadTime: new Date().toISOString(),
        },
    ]);
}
exports.emitReadMessage = emitReadMessage;
function kickMemberOutSocketRoom(memberId, conversationId) {
    var member = online.find(function (member) { return member.id === memberId; });
    var _loop_1 = function (el) {
        try {
            io.sockets.connected[el.socketId].leave("conversation_" + conversationId);
            var member_1 = online.find(function (member) { return member.id === memberId && member.role === MemberType.APP; });
            if (member_1)
                member_1.conversations = member_1.conversations.filter(function (item) { return item.socketId !== el.socketId; });
        }
        catch (error) { }
    };
    for (var _i = 0, _a = member.conversations; _i < _a.length; _i++) {
        var el = _a[_i];
        _loop_1(el);
    }
}
exports.kickMemberOutSocketRoom = kickMemberOutSocketRoom;
function startTyping(client, memberId) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            client.on(_enums_1.EventSocket.START_TYPING, function (_a) {
                var conversationId = _a.conversationId;
                return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        conversationId = Number(conversationId);
                        if (!conversationId)
                            return [2 /*return*/];
                        io.in("conversation_" + conversationId).emit(_enums_1.EventSocket.TYPING, [
                            { memberId: memberId, memberType: client.role },
                        ]);
                        return [2 /*return*/];
                    });
                });
            });
            return [2 /*return*/];
        });
    });
}
exports.startTyping = startTyping;
function endTyping(client, memberId) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            client.on(_enums_1.EventSocket.END_TYPING, function (_a) {
                var conversationId = _a.conversationId;
                return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        conversationId = Number(conversationId);
                        if (!conversationId)
                            return [2 /*return*/];
                        io.in("conversation_" + conversationId).emit(_enums_1.EventSocket.OFF_TYPING, [
                            { memberId: memberId, memberType: client.role },
                        ]);
                        return [2 /*return*/];
                    });
                });
            });
            return [2 /*return*/];
        });
    });
}
exports.endTyping = endTyping;
//# sourceMappingURL=socket.js.map