"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGPSSchema = exports.editMyProfileSchema = void 0;
var _enums_1 = require("$enums");
exports.editMyProfileSchema = {
    type: "object",
    required: [],
    additionalProperties: false,
    properties: {
        avatar: {
            type: "string",
        },
        showLocation: {
            type: "number",
            enum: [_enums_1.ShowLocation.YES, _enums_1.ShowLocation.NO],
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
exports.updateGPSSchema = {
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
//# sourceMappingURL=app.member.js.map