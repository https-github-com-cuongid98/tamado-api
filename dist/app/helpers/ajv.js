"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
var ajv_1 = __importDefault(require("ajv"));
var response_1 = require("./response");
var _enums_1 = require("$enums");
var dateTimeRegex = new RegExp('^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])T(00|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9].[0-9][0-9][0-9])Z$');
function Ajv(config) {
    var ajv = config ? new ajv_1.default(config) : new ajv_1.default();
    ajv.addFormat('datetimeISO', {
        validate: function (dateTimeString) { return dateTimeRegex.test(dateTimeString); },
    });
    return ajv;
}
exports.default = Ajv;
function validate(schemaKeyRef, data) {
    var Ajv = new ajv_1.default();
    Ajv.addFormat('ISOString', {
        validate: function (dateTimeString) { return dateTimeRegex.test(dateTimeString); },
    });
    var validate = Ajv.validate(schemaKeyRef, data);
    if (!validate) {
        throw new response_1.HttpError(_enums_1.ErrorCode.Invalid_Input, 422, Ajv.errors); // 422 Unprocessable Entity
    }
    return;
}
exports.validate = validate;
//# sourceMappingURL=ajv.js.map