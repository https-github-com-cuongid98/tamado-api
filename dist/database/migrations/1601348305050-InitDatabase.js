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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitDatabase1601348305050 = void 0;
var InitDatabase1601348305050 = /** @class */ (function () {
    function InitDatabase1601348305050() {
        this.name = 'InitDatabase1601348305050';
    }
    InitDatabase1601348305050.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query('CREATE TABLE `language` (`code` varchar(50) NOT NULL, `name` varchar(50) NOT NULL, `status` tinyint NOT NULL, `vi_name` varchar(50) NOT NULL, `priority` smallint NOT NULL, `flag_icon` varchar(500) NOT NULL, `is_default` tinyint NOT NULL, `created_date` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`code`)) ENGINE=InnoDB')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('CREATE TABLE `language_env` (`code` varchar(50) NOT NULL, `name` varchar(500) NOT NULL, `status` text NOT NULL, PRIMARY KEY (`code`)) ENGINE=InnoDB')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('CREATE TABLE `language_static` (`language_key` varchar(500) NOT NULL, `language_default_value` varchar(500) NOT NULL, PRIMARY KEY (`language_key`)) ENGINE=InnoDB')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('CREATE TABLE `language_static_by_env` (`language_static_key` varchar(500) NOT NULL, `language_env_code` varchar(50) NOT NULL, PRIMARY KEY (`language_static_key`, `language_env_code`)) ENGINE=InnoDB')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('CREATE TABLE `language_static_by_lang` (`language_static_key` varchar(500) NOT NULL, `language_code` varchar(50) NOT NULL, `language_value` varchar(500) NOT NULL, PRIMARY KEY (`language_static_key`, `language_code`)) ENGINE=InnoDB')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('CREATE TABLE `member` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `username` varchar(255) NOT NULL, `age` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('CREATE TABLE `permission` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `group_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('CREATE TABLE `permission_group` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(150) NOT NULL, UNIQUE INDEX `IDX_032c209da98ae7c1a915b51c27` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE `role` (`id` int NOT NULL AUTO_INCREMENT, `role_name` varchar(255) NOT NULL, `is_system` tinyint NOT NULL COMMENT '1: is a system, 0: not system' DEFAULT 0, `is_visible` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX `IDX_4810bc474fe6394c6f58cb7c9e` (`role_name`), PRIMARY KEY (`id`)) ENGINE=InnoDB")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('CREATE TABLE `role_permission` (`role_id` int NOT NULL, `permission_id` int NOT NULL, PRIMARY KEY (`role_id`, `permission_id`)) ENGINE=InnoDB')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE `user` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `username` varchar(100) NOT NULL, `password` text NOT NULL, `full_name` varchar(255) NULL, `email` varchar(255) NULL, `mobile` varchar(20) NULL, `avatar` varchar(255) NULL, `status` tinyint NOT NULL COMMENT '0: Inactive, 1: Active.' DEFAULT 1, `role_id` tinyint NOT NULL, `created_date` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `last_logged` datetime NULL, `last_change_pass` datetime NULL, `modified_date` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `refresh_token` text NULL, UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`), UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), UNIQUE INDEX `IDX_29fd51e9cf9241d022c5a4e02e` (`mobile`), PRIMARY KEY (`id`)) ENGINE=InnoDB")];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('CREATE TABLE `user_permission` (`user_id` int NOT NULL, `permission_id` int NOT NULL, PRIMARY KEY (`user_id`, `permission_id`)) ENGINE=InnoDB')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('ALTER TABLE `role_permission` ADD CONSTRAINT `FK_3d0a7155eafd75ddba5a7013368` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION')];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    InitDatabase1601348305050.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query('ALTER TABLE `role_permission` DROP FOREIGN KEY `FK_3d0a7155eafd75ddba5a7013368`')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP TABLE `user_permission`')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP INDEX `IDX_29fd51e9cf9241d022c5a4e02e` ON `user`')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP INDEX `IDX_78a916df40e02a9deb1c4b75ed` ON `user`')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP TABLE `user`')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP TABLE `role_permission`')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP INDEX `IDX_4810bc474fe6394c6f58cb7c9e` ON `role`')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP TABLE `role`')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP INDEX `IDX_032c209da98ae7c1a915b51c27` ON `permission_group`')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP TABLE `permission_group`')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP TABLE `permission`')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP TABLE `member`')];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP TABLE `language_static_by_lang`')];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP TABLE `language_static_by_env`')];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP TABLE `language_static`')];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP TABLE `language_env`')];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP TABLE `language`')];
                    case 18:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return InitDatabase1601348305050;
}());
exports.InitDatabase1601348305050 = InitDatabase1601348305050;
//# sourceMappingURL=1601348305050-InitDatabase.js.map