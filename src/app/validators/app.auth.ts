export const loginSchema: AjvSchema = {
  type: "object",
  required: ["phone", "password"],
  additionalProperties: false,
  properties: {
    phone: {
      type: "string",
      pattern: "^\\d{10,12}$",
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
      pattern: "^\\d{11}$",
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
  required: ["phone"],
  additionalProperties: false,
  properties: {
    phone: {
      type: "string",
      pattern: "^\\d{11}$",
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
      pattern: "^\\d{11}$",
    },
    verifiedCode: {
      type: "string",
      pattern: "^\\d{6}$",
    },
  },
};

export const registerSchema: AjvSchema = {
  type: "object",
  required: ["phone", "password", "name", "birthday"],
  additionalProperties: false,
  properties: {
    phone: {
      type: "string",
      pattern: "^\\d{11}$",
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
    hobby: {
      type: "string",
    },
  },
};
