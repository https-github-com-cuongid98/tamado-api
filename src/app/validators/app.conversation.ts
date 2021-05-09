import { MessagesType } from "$enums";

export const getOrCreateConversationSchema: AjvSchema = {
  type: "object",
  required: ["targetIds"],
  additionalProperties: false,
  properties: {
    targetIds: {
      type: "array",
      items: {
        type: "number",
      },
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

export const closeVideoCallSchema: AjvSchema = {
  type: "object",
  required: ["videoCallId"],
  additionalProperties: false,
  properties: {
    videoCallId: {
      type: "number",
      minimum: 1,
    },
  },
};

export const startVideoCallSchema: AjvSchema = {
  type: "object",
  required: ["targetIds"],
  additionalProperties: false,
  properties: {
    targetIds: {
      type: "array",
      items: {
        type: "number",
      },
    },
  },
};
