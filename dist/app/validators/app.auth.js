"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.checkVerifiedCodeSchema = exports.requestVerifiedCodeSchema = exports.resetPasswordSchema = exports.changePasswordSchema = exports.loginSchema = void 0;
var _enums_1 = require("$enums");
exports.loginSchema = {
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
exports.changePasswordSchema = {
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
exports.resetPasswordSchema = {
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
exports.requestVerifiedCodeSchema = {
    type: "object",
    required: ["phone", "type"],
    additionalProperties: false,
    properties: {
        phone: {
            type: "string",
            pattern: "^\\d{11}$",
        },
        type: {
            type: "number",
            enum: [_enums_1.VerifiedCodeType.REGISTER, _enums_1.VerifiedCodeType.RESET_PASSWORD],
        },
    },
};
exports.checkVerifiedCodeSchema = {
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
exports.registerSchema = {
    type: "object",
    required: ["phone", "password", "name", "birthday", "gender"],
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
        gender: {
            type: "number",
            enum: [_enums_1.Gender.FEMALE, _enums_1.Gender.MALE],
        },
    },
};
//# sourceMappingURL=app.auth.js.map