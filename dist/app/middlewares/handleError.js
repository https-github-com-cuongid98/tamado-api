"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
var log_1 = __importDefault(require("$helpers/log"));
var _enums_1 = require("$enums");
exports.handleError = function (error, req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var statusCode, errorCode, errorKey, errorMessage, responseData;
    return __generator(this, function (_a) {
        statusCode = error.statusCode, errorCode = error.errorCode, errorKey = error.errorKey, errorMessage = error.errorMessage;
        loggingError(req, error);
        responseData = {
            success: false,
            errorCode: errorCode,
            errorKey: errorKey,
            errorMessage: errorMessage,
            data: null,
        };
        return [2 /*return*/, res.status(statusCode).send(responseData)];
    });
}); };
function loggingError(req, error) {
    var method = req.method;
    var fullPath = req.originalUrl;
    var body = req.body || [];
    var logger = error.logger ? error.logger : log_1.default("INFO");
    delete error.logger;
    switch (error.errorCode) {
        case _enums_1.ErrorCode.Unknown_Error:
            var err = error["rawError"] || error;
            logger.error(err);
            break;
        case _enums_1.ErrorCode.Invalid_Input:
            logger.error(error.errorMessage);
            break;
        default:
            logger.error("" + error.errorKey + (error.errorMessage ? "\nReason: " + error.errorMessage : ""));
            break;
    }
    logger.error("Method: " + method + " | FullPath: " + fullPath + " | Body: " + JSON.stringify(body) + "\n");
}
//# sourceMappingURL=handleError.js.map