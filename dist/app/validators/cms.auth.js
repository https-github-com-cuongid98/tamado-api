"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.requestAccessTokenSchema = exports.loginSchema = void 0;
exports.loginSchema = {
    type: 'object',
    required: ['username', 'password'],
    additionalProperties: false,
    properties: {
        username: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
        },
        password: {
            type: 'string',
            minLength: 6,
            maxLength: 255,
        },
    },
};
exports.requestAccessTokenSchema = {
    type: 'object',
    required: ['refreshToken'],
    additionalProperties: false,
    properties: {
        refreshToken: {
            type: 'string',
            minLength: 1,
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
//# sourceMappingURL=cms.auth.js.map