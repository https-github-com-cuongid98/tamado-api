import { ShowLocation } from "$enums";

export const editMyProfileSchema: AjvSchema = {
  type: "object",
  required: [],
  additionalProperties: false,
  properties: {
    avatar: {
      type: "string",
    },
    showLocation: {
      type: "number",
      enum: [ShowLocation.YES, ShowLocation.NO],
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
