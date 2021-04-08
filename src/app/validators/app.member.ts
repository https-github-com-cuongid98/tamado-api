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
        email: {
          format: "email",
        },
        introduce: {
          type: "string",
        },
        hobby: {
          type: "string",
        },
      },
    },
    memberImages: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "URL"],
        additionalProperties: false,
        properties: {
          id: {
            type: "number",
          },
          URL: {
            type: "string",
          },
        },
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
