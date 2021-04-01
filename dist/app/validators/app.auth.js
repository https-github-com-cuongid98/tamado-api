"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.checkVerifiedCodeSchema = exports.checkEmailSchema = exports.requestVerifiedCodeSchema = exports.resetPasswordSchema = exports.changePasswordSchema = exports.loginSchema = void 0;
exports.loginSchema = {
    type: 'object',
    required: ['email', 'password'],
    additionalProperties: false,
    properties: {
        email: {
            type: 'string',
            pattern: '^(\\w+([\\.\\+-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+)$',
        },
        password: {
            type: 'string',
            minLength: 6,
            maxLength: 255,
        },
    },
};
exports.changePasswordSchema = {
    type: 'object',
    required: ['oldPassword', 'newPassword'],
    additionalProperties: false,
    properties: {
        oldPassword: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
        },
        newPassword: {
            type: 'string',
            minLength: 6,
            maxLength: 255,
        },
    },
};
exports.resetPasswordSchema = {
    type: 'object',
    required: ['email', 'newPassword', 'verifiedCode'],
    additionalProperties: false,
    properties: {
        email: {
            type: 'string',
            pattern: '^(\\w+([\\.\\+-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+)$',
        },
        newPassword: {
            type: 'string',
            minLength: 6,
            maxLength: 255,
        },
        verifiedCode: {
            type: 'string',
            pattern: '^\\d{6}$',
        },
    },
};
exports.requestVerifiedCodeSchema = {
    type: 'object',
    required: ['email'],
    additionalProperties: false,
    properties: {
        email: {
            type: 'string',
            pattern: '^(\\w+([\\.\\+-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+)$',
        },
    },
};
exports.checkEmailSchema = {
    type: 'object',
    required: ['email'],
    additionalProperties: false,
    properties: {
        email: {
            type: 'string',
            pattern: '^(\\w+([\\.\\+-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+)$',
        },
    },
};
exports.checkVerifiedCodeSchema = {
    type: 'object',
    required: ['email', 'verifiedCode'],
    additionalProperties: false,
    properties: {
        email: {
            type: 'string',
            pattern: '^(\\w+([\\.\\+-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+)$',
        },
        verifiedCode: {
            type: 'string',
            pattern: '^\\d{6}$',
        },
    },
};
exports.registerSchema = {
    type: 'object',
    required: ['email', 'password', 'verifiedCode'],
    additionalProperties: false,
    properties: {
        email: {
            type: 'string',
            pattern: '^(\\w+([\\.\\+-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+)$',
        },
        password: {
            type: 'string',
            minLength: 6,
            maxLength: 255,
        },
        verifiedCode: {
            type: 'string',
            pattern: '^\\d{6}$',
        },
    },
};
//# sourceMappingURL=app.auth.js.map