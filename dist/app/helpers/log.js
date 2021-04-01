"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log4js_1 = require("log4js");
log4js_1.configure({
    appenders: {
        console: {
            type: 'console',
        },
        errorFile: {
            type: 'dateFile',
            filename: 'logs/error.log',
            keepFileExt: true,
        },
        errors: {
            type: 'logLevelFilter',
            level: 'ERROR',
            appender: 'errorFile',
        },
    },
    categories: {
        default: { appenders: ['console', 'errors'], level: 'debug' },
    },
});
function log(service) {
    var logger = log4js_1.getLogger(service);
    return logger;
}
exports.default = log;
//# sourceMappingURL=log.js.map