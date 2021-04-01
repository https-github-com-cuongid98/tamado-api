"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.done = exports.HttpErrorController = exports.HttpError = void 0;
var _enums_1 = require("$enums");
var _config_1 = __importDefault(require("$config"));
var HttpError = /** @class */ (function (_super) {
    __extends(HttpError, _super);
    function HttpError(error, statusCode, errorMessage) {
        if (errorMessage === void 0) { errorMessage = ""; }
        var _this = _super.call(this) || this;
        if (error.hasOwnProperty("errorCode")) {
            _this.errorCode = error["errorCode"];
            _this.statusCode = error["statusCode"] || 400;
        }
        else {
            _this.errorCode =
                typeof error === "number" ? error : Number(error.message) | 0;
            _this.statusCode = statusCode || 400;
        }
        _this["rawError"] = error;
        _this.errorKey = _enums_1.ErrorCode[_this.errorCode];
        _this.errorMessage =
            _config_1.default.environment === "development" && errorMessage ? errorMessage : "";
        return _this;
    }
    return HttpError;
}(Error));
exports.HttpError = HttpError;
var HttpErrorController = /** @class */ (function (_super) {
    __extends(HttpErrorController, _super);
    function HttpErrorController(error, logger, statusCode) {
        var _this = _super.call(this) || this;
        if (error.hasOwnProperty("errorCode")) {
            _this.errorCode = error["errorCode"];
            _this.statusCode = error["statusCode"] || 400;
        }
        else {
            _this.errorCode =
                typeof error === "number" ? error : Number(error.message) | 0;
            _this.statusCode = statusCode || 400;
        }
        _this["rawError"] = error;
        _this.errorKey = _enums_1.ErrorCode[_this.errorCode];
        _this.errorMessage =
            _config_1.default.environment === "development" && error["devMessage"]
                ? error["devMessage"]
                : "";
        _this.logger = logger;
        return _this;
    }
    return HttpErrorController;
}(Error));
exports.HttpErrorController = HttpErrorController;
exports.done = function (res, data, statusCode) {
    if (data === void 0) { data = null; }
    if (statusCode === void 0) { statusCode = 200; }
    if (data && data.paging === true) {
        return res.status(statusCode).send(__assign({ success: true, totalPages: data.totalPages, pageIndex: data.pageIndex, totalItems: data.totalItems, data: data.data }, data.metadata));
    }
    return res.status(statusCode).send({ data: data, success: true });
};
//# sourceMappingURL=response.js.map