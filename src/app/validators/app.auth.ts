import { Gender, VerifiedCodeType } from "$enums";

export const loginSchema: AjvSchema = {
  type: "object",
  required: ["phone", "password"],
  additionalProperties: false,
  properties: {
    phone: {
      type: "string",
      pattern: `^([0]|[84])(\\d{9})$`,
    },
    password: {
      type: "string",
      minLength: 6,
      maxLength: 255,
    },
  },
};

export const changePasswordSchema: AjvSchema = {
  type: "object",
  required: ["oldPassword", "newPassword"],
  additionalProperties: false,
  properties: {
    oldPassword: {
      type: "string",
      minLength: 6,
      maxLength: 255,
    },
    newPassword: {
      type: "string",
      minLength: 6,
      maxLength: 255,
    },
  },
};

export const resetPasswordSchema: AjvSchema = {
  type: "object",
  required: ["phone", "newPassword", "verifiedCode"],
  additionalProperties: false,
  properties: {
    phone: {
      type: "string",
      pattern: `^([0]|[84])(\\d{9})$`,
    },
    newPassword: {
      type: "string",
      minLength: 6,
      maxLength: 255,
    },
    verifiedCode: {
      type: "string",
      pattern: "^\\d{6}$",
    },
  },
};

export const requestVerifiedCodeSchema: AjvSchema = {
  type: "object",
  required: ["phone", "type"],
  additionalProperties: false,
  properties: {
    phone: {
      type: "string",
      pattern: `^([0]|[84])(\\d{9})$`,
    },
    type: {
      type: "number",
      enum: [VerifiedCodeType.REGISTER, VerifiedCodeType.RESET_PASSWORD],
    },
  },
};

export const checkVerifiedCodeSchema: AjvSchema = {
  type: "object",
  required: ["phone", "verifiedCode"],
  additionalProperties: false,
  properties: {
    phone: {
      type: "string",
      pattern: `^([0]|[84])(\\d{9})$`,
    },
    verifiedCode: {
      type: "string",
      pattern: "^\\d{6}$",
    },
  },
};

export const registerSchema: AjvSchema = {
  type: "object",
  required: ["phone", "password", "name", "birthday", "gender"],
  additionalProperties: false,
  properties: {
    phone: {
      type: "string",
      pattern: `^([0]|[84])(\\d{9})$`,
    },
    password: {
      type: "string",
      minLength: 6,
      maxLength: 255,
    },
    name: {
      type: "string",
    },
    email: {
      format: "email",
    },
    birthday: {
      type: "string",
    },
    introduce: {
      type: "string",
    },
    hobbyIds: {
      type: "array",
      items: {
        type: "number",
      },
    },
    gender: {
      type: "number",
      enum: [Gender.FEMALE, Gender.MALE],
    },
    jobId: {
      type: "number",
    },
  },
};
