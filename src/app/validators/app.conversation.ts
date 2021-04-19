import { MessagesType } from "$enums";

export const getOrCreateConversationSchema: AjvSchema = {
  type: "object",
  required: ["targetId"],
  additionalProperties: false,
  properties: {
    targetId: {
      type: "number",
    },
  },
};

export const sendMessageSchema: AjvSchema = {
  type: "object",
  required: ["conversationId", "content", "messageType"],
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
      enum: [MessagesType.TEXT, MessagesType.IMAGE],
    },
    metadata: {
      type: ["object", "null"],
    },
  },
};
