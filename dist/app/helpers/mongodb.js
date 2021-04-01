"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var log_1 = __importDefault(require("$helpers/log"));
var _config_1 = __importDefault(require("$config"));
var logger = log_1.default("Index");
function createMongoConnection() {
    mongoose_1.default.connect(_config_1.default.mongoDB.database, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        user: _config_1.default.mongoDB.username,
        pass: _config_1.default.mongoDB.password,
    });
    mongoose_1.default.connection.on("connected", function () {
        logger.info("Mongoose connected");
    });
    mongoose_1.default.connection.on("error", function (err) {
        logger.error("Cannot connect to mongodb");
        throw err;
    });
    mongoose_1.default.connection.on("disconnected", function () {
        logger.error("Mongoose disconnected");
    });
}
exports.default = createMongoConnection;
//# sourceMappingURL=mongodb.js.map