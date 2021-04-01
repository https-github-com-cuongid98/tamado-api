"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var _enums_1 = require("$enums");
var Schema = mongoose_1.default.Schema;
exports.default = mongoose_1.default.model("Messages", new Schema({
    conversationId: { type: Number, required: true },
    memberId: { type: Number, required: true },
    body: { type: String, required: false },
    image: { type: String, required: false, default: null },
    status: { type: Number, required: true, default: _enums_1.CommonStatus.ACTIVE },
    messageType: { type: Number, default: _enums_1.MessagesType.TEXT },
    memberType: { type: Number, default: _enums_1.ConversationMemberType.MEMBER },
    createdAt: { type: Number, required: true },
    metadata: { type: Schema.Types.Mixed },
}));
//# sourceMappingURL=Message.js.map