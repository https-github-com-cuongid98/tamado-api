"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileLanguageSchema = exports.getFileLanguageSchema = exports.addLanguageKeySchema = exports.getListLanguageKeySchema = exports.updateLanguageSchema = exports.addLanguageSchema = exports.getListLanguageSchema = void 0;
var _enums_1 = require("$enums");
exports.getListLanguageSchema = {
    type: 'object',
    required: [],
    additionalProperties: false,
    properties: {
        status: {
            type: ['null', 'number'],
        },
    },
};
exports.addLanguageSchema = {
    type: 'object',
    required: ['code', 'name', 'isDefault', 'flagIcon'],
    additionalProperties: false,
    properties: {
        code: {
            type: 'string',
            minLength: 1,
        },
        status: {
            enum: [_enums_1.CommonStatus.ACTIVE, _enums_1.CommonStatus.INACTIVE],
        },
        name: {
            type: 'string',
            minLength: 1,
        },
        viName: {
            type: 'string',
        },
        priority: {
            type: 'integer',
        },
        flagIcon: {
            type: 'string',
            minLength: 1,
        },
        isDefault: {
            enum: [_enums_1.CommonStatus.ACTIVE, _enums_1.CommonStatus.INACTIVE],
        },
    },
};
exports.updateLanguageSchema = {
    type: 'object',
    required: ['code'],
    additionalProperties: false,
    properties: {
        code: {
            type: 'string',
            minLength: 1,
        },
        status: {
            enum: [_enums_1.CommonStatus.ACTIVE, _enums_1.CommonStatus.INACTIVE],
        },
        name: {
            type: 'string',
            minLength: 1,
        },
        viName: {
            type: 'string',
        },
        priority: {
            type: 'integer',
        },
        flagIcon: {
            type: 'string',
            minLength: 1,
        },
        isDefault: {
            enum: [_enums_1.CommonStatus.ACTIVE, _enums_1.CommonStatus.INACTIVE],
        },
    },
};
exports.getListLanguageKeySchema = {
    type: 'object',
    required: [],
    additionalProperties: false,
    properties: {
        keyword: {
            type: 'string',
        },
        environments: {
            type: 'array',
            items: {
                type: 'string',
                minLength: 1,
            },
        },
        take: {
            type: 'integer',
            minimum: 1,
        },
        pageIndex: {
            type: 'integer',
            minimum: 1,
        },
    },
};
exports.addLanguageKeySchema = {
    type: 'object',
    required: [],
    additionalProperties: false,
    properties: {
        key: {
            type: 'string',
            minLength: 1,
        },
        defaultValue: {
            type: 'string',
            minLength: 1,
        },
        environment: {
            type: 'string',
        },
        translations: {
            type: 'array',
            items: {
                type: 'object',
                required: ['code', 'value'],
                additionalProperties: false,
                properties: {
                    code: {
                        type: 'string',
                        minLength: 1,
                    },
                    value: {
                        type: 'string',
                    },
                },
            },
        },
    },
};
exports.getFileLanguageSchema = {
    type: 'object',
    required: ['environment'],
    additionalProperties: false,
    properties: {
        environment: {
            type: 'string',
            minLength: 1,
        },
        code: {
            type: 'string',
            minLength: 1,
        },
    },
};
exports.uploadFileLanguageSchema = {
    type: 'object',
    required: ['environment', 'code', 'languages'],
    additionalProperties: false,
    properties: {
        environment: {
            type: 'string',
            minLength: 1,
        },
        code: {
            type: 'string',
            minLength: 1,
        },
        languages: {
            type: 'object',
        },
    },
};
//# sourceMappingURL=cms.language.js.map