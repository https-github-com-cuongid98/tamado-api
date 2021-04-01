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
exports.updateVersionConfig = exports.getDetailConfig = exports.updateConfig = exports.getListConfig = void 0;
var Config_1 = __importDefault(require("$entities/Config"));
var _enums_1 = require("$enums");
var typeorm_1 = require("typeorm");
function getListConfig(params) {
    return __awaiter(this, void 0, void 0, function () {
        var configRepo, configs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    configRepo = typeorm_1.getRepository(Config_1.default);
                    configs = configRepo
                        .createQueryBuilder('config')
                        .select([
                        'config.key',
                        'config.name',
                        'config.value',
                        'config.type',
                        'config.order',
                        'config.metadata',
                        'config.isSystem',
                        'config.createdBy',
                    ]);
                    if (params.keyword)
                        configs.where('config.name like :name', { name: "%" + params.keyword + "%" });
                    return [4 /*yield*/, configs.getMany()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getListConfig = getListConfig;
function updateConfig(key, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, typeorm_1.getConnection().queryResultCache.remove([_enums_1.KeyCacheRedis.CONFIG])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, typeorm_1.getRepository(Config_1.default).update(key, params)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.updateConfig = updateConfig;
function getDetailConfig(key) {
    return __awaiter(this, void 0, void 0, function () {
        var config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, typeorm_1.getRepository(Config_1.default).findOne(key)];
                case 1:
                    config = _a.sent();
                    if (!config)
                        _enums_1.ErrorCode.Not_Found;
                    return [2 /*return*/, config];
            }
        });
    });
}
exports.getDetailConfig = getDetailConfig;
// Insert key config if not exists.
// Increment value of key.
// Clear cache redis.
function updateVersionConfig(transaction, configKeys) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, transaction.query('INSERT INTO config (`key`, `name`, `value`, `is_system`, `created_by`, `order`) ' +
                        'SELECT temp.* FROM ( ' +
                        'SELECT ? as `key`, ? as `name`, 0 as `value`, 1 as is_system, 1 as created_by, 0 as `order`) as temp ' +
                        'WHERE NOT EXISTS ( SELECT `key` FROM config WHERE `key` = ?) LIMIT 1', [configKeys, configKeys, configKeys])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, transaction.query('UPDATE config SET `value` = IFNULL(`value`, 0) + 1  WHERE `key` = ?', [configKeys])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, transaction.connection.queryResultCache.remove([_enums_1.KeyCacheRedis.CONFIG])];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateVersionConfig = updateVersionConfig;
//# sourceMappingURL=cms.config.js.map