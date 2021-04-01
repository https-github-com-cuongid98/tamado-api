"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _config_1 = __importDefault(require("$config"));
var log_1 = __importDefault(require("$helpers/log"));
var logger = log_1.default('Request');
function logRequest(req, res, next) {
    if (_config_1.default.environment !== 'production') {
        var method = req.method;
        var fullPath = req.originalUrl;
        var body = req.body || [];
        logger.info("Method: " + method + " | FullPath: " + fullPath + " | Body: " + JSON.stringify(body));
    }
    next();
}
exports.default = logRequest;
//# sourceMappingURL=logRequest.js.map