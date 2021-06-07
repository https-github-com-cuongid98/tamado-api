import { CommonStatus, ShowLocation } from "$enums";

export const editMyProfileSchema: AjvSchema = {
  type: "object",
  required: [],
  additionalProperties: false,
  properties: {
    avatar: {
      type: "string",
    },
    detail: {
      type: "object",
      required: [],
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
        },
        gender: {
          type: "number",
        },
        email: {
          format: "email",
        },
        introduce: {
          type: "string",
        },
        birthday: {
          type: "string",
        },
      },
    },
    images: {
      type: "array",
      items: {
        type: "string",
      },
    },
    hobbyIds: {
      type: "array",
      items: {
        type: "number",
      },
    },
  },
};

export const updateGPSSchema: AjvSchema = {
  type: "object",
  required: ["lat", "lng"],
  additionalProperties: false,
  properties: {
    lat: {
      type: "number",
    },
    lng: {
      type: "number",
    },
  },
};

export const showLocationSchema: AjvSchema = {
  type: "object",
  required: ["showLocation"],
  additionalProperties: false,
  properties: {
    showLocation: {
      type: "number",
      enum: [ShowLocation.NO, ShowLocation.YES],
    },
  },
};

export const receiveNotificationMemberSchema: AjvSchema = {
  type: "object",
  required: ["receiveNotification"],
  additionalProperties: false,
  properties: {
    receiveNotification: {
      type: "number",
      enum: [CommonStatus.ACTIVE, CommonStatus.INACTIVE],
    },
  },
};

export const updateImageToAvatarSchema: AjvSchema = {
  type: "object",
  required: ["avatar"],
  additionalProperties: false,
  properties: {
    avatar: {
      type: "string",
      minLength: 1,
      maxLength: 255,
    },
  },
};
