"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.checkVerifiedCodeSchema = exports.requestVerifiedCodeSchema = exports.resetPasswordSchema = exports.changePasswordSchema = exports.loginSchema = void 0;
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
            minLength: 1,
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
    required: ["email", "newPassword", "verifiedCode"],
    additionalProperties: false,
    properties: {
        email: {
            type: "string",
            pattern: "^(\\w+([\\.\\+-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+)$",
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
    required: ["phone"],
    additionalProperties: false,
    properties: {
        phone: {
            type: "string",
            pattern: "^\\d{11}$",
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
    required: ["phone", "password"],
    additionalProperties: false,
    properties: {
        phone: {
            type: "string",
            pattern: "^\\d{4}$",
        },
        password: {
            type: "string",
            minLength: 6,
            maxLength: 255,
        },
    },
};
//# sourceMappingURL=app.auth.js.map