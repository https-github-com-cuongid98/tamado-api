"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var Config = /** @class */ (function () {
    function Config() {
    }
    __decorate([
        typeorm_1.PrimaryColumn({ type: "varchar", name: "key", length: 200 }),
        __metadata("design:type", String)
    ], Config.prototype, "key", void 0);
    __decorate([
        typeorm_1.Column({ type: "varchar", name: "name", length: 255 }),
        __metadata("design:type", String)
    ], Config.prototype, "name", void 0);
    __decorate([
        typeorm_1.Column({ type: "text" }),
        __metadata("design:type", String)
    ], Config.prototype, "value", void 0);
    __decorate([
        typeorm_1.Column({ type: "varchar", nullable: true, length: 50 }),
        __metadata("design:type", String)
    ], Config.prototype, "type", void 0);
    __decorate([
        typeorm_1.Column({ type: "text", nullable: true }),
        __metadata("design:type", String)
    ], Config.prototype, "metadata", void 0);
    __decorate([
        typeorm_1.Column({ type: "tinyint", nullable: true }),
        __metadata("design:type", Number)
    ], Config.prototype, "order", void 0);
    __decorate([
        typeorm_1.Column({ type: "tinyint", nullable: true }),
        __metadata("design:type", Number)
    ], Config.prototype, "isSystem", void 0);
    __decorate([
        typeorm_1.Column({ type: "bigint", nullable: true, unsigned: true }),
        __metadata("design:type", Number)
    ], Config.prototype, "createdBy", void 0);
    __decorate([
        typeorm_1.CreateDateColumn({ type: "datetime" }),
        __metadata("design:type", Object)
    ], Config.prototype, "createdAt", void 0);
    Config = __decorate([
        typeorm_1.Entity("configs")
    ], Config);
    return Config;
}());
exports.default = Config;
//# sourceMappingURL=Config.js.map