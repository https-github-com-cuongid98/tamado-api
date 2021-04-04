"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var decorator_1 = require("$helpers/decorator");
var app_1 = require("$middlewares/app");
var ajv_1 = require("$helpers/ajv");
var app_auth_1 = require("$validators/app.auth");
var service = __importStar(require("$services/app.auth"));
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.prototype.requestVerifiedCode = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = req.body;
                        ajv_1.validate(app_auth_1.requestVerifiedCodeSchema, body);
                        return [4 /*yield*/, service.createVerifiedCode(body)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AuthController.prototype.checkVerifiedCode = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = req.body;
                        ajv_1.validate(app_auth_1.checkVerifiedCodeSchema, body);
                        return [4 /*yield*/, service.checkVerifiedCode(body)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AuthController.prototype.register = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = req.body;
                        ajv_1.validate(app_auth_1.registerSchema, body);
                        return [4 /*yield*/, service.register(body)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AuthController.prototype.login = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = req.body;
                        ajv_1.validate(app_auth_1.loginSchema, body);
                        return [4 /*yield*/, service.login(body)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AuthController.prototype.requestAccessToken = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var memberId, accessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        memberId = req.memberId;
                        return [4 /*yield*/, service.createAccessToken(memberId)];
                    case 1:
                        accessToken = _a.sent();
                        return [2 /*return*/, { accessToken: accessToken }];
                }
            });
        });
    };
    AuthController.prototype.changePassword = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var memberId, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        memberId = req.memberId, body = req.body;
                        ajv_1.validate(app_auth_1.changePasswordSchema, body);
                        return [4 /*yield*/, service.changePassword(memberId, body)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.resetPassword = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = req.body;
                        ajv_1.validate(app_auth_1.resetPasswordSchema, body);
                        return [4 /*yield*/, service.resetPassword(body)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        decorator_1.Post("/request-verified-code", []),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "requestVerifiedCode", null);
    __decorate([
        decorator_1.Post("/check-verified-code", []),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "checkVerifiedCode", null);
    __decorate([
        decorator_1.Post("/register", []),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "register", null);
    __decorate([
        decorator_1.Post("/login", []),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "login", null);
    __decorate([
        decorator_1.Post("/request-access-token", [app_1.checkRefreshTokenApp]),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "requestAccessToken", null);
    __decorate([
        decorator_1.Put("/change-password"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "changePassword", null);
    __decorate([
        decorator_1.Put("/reset-password", []),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "resetPassword", null);
    AuthController = __decorate([
        decorator_1.APP("/auth")
    ], AuthController);
    return AuthController;
}());
exports.default = AuthController;
//# sourceMappingURL=app.auth.js.map