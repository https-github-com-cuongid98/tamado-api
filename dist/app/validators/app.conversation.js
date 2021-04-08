"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageSchema = exports.getOrCreateConversationSchema = void 0;
var _enums_1 = require("$enums");
exports.getOrCreateConversationSchema = {
    type: "object",
    required: ["targetId"],
    additionalProperties: false,
    properties: {
        targetId: {
            type: "number",
        },
    },
};
exports.sendMessageSchema = {
    type: "object",
    required: ["conversationId", "content", "messageType", "image", "metadata"],
    additionalProperties: false,
    properties: {
        conversationId: {
            type: "number",
            minimum: 1,
        },
        content: {
            type: "string",
        },
        image: {
            type: "string",
        },
        messageType: {
            type: "number",
            enum: [_enums_1.MessagesType.TEXT, _enums_1.MessagesType.IMAGE],
        },
        metadata: {
            type: ["object", "null"],
        },
    },
};
//# sourceMappingURL=app.conversation.js.map