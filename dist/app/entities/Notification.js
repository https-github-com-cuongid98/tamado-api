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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _enums_1 = require("$enums");
var typeorm_1 = require("typeorm");
var Member_1 = __importDefault(require("./Member"));
var Notification = /** @class */ (function () {
    function Notification() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({ type: "int", unsigned: true }),
        __metadata("design:type", Number)
    ], Notification.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column({ type: "int", unsigned: true }),
        __metadata("design:type", Number)
    ], Notification.prototype, "memberId", void 0);
    __decorate([
        typeorm_1.Column({ type: "tinyint", unique: true }),
        __metadata("design:type", Number)
    ], Notification.prototype, "notificationType", void 0);
    __decorate([
        typeorm_1.Column({ type: "tinyint", unique: true }),
        __metadata("design:type", Number)
    ], Notification.prototype, "redirectId", void 0);
    __decorate([
        typeorm_1.Column({
            type: "tinyint",
            default: _enums_1.IsRead.UN_SEEN,
        }),
        __metadata("design:type", Number)
    ], Notification.prototype, "isRead", void 0);
    __decorate([
        typeorm_1.Column({
            type: "tinyint",
            default: _enums_1.CommonStatus.ACTIVE,
        }),
        __metadata("design:type", Number)
    ], Notification.prototype, "status", void 0);
    __decorate([
        typeorm_1.Column({ type: "text" }),
        __metadata("design:type", String)
    ], Notification.prototype, "content", void 0);
    __decorate([
        typeorm_1.Column({ type: "text" }),
        __metadata("design:type", String)
    ], Notification.prototype, "metaData", void 0);
    __decorate([
        typeorm_1.CreateDateColumn({ type: "datetime", nullable: true }),
        __metadata("design:type", Date)
    ], Notification.prototype, "createdDate", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return Member_1.default; }),
        typeorm_1.JoinColumn({ referencedColumnName: "id", name: "memberId" }),
        __metadata("design:type", Member_1.default)
    ], Notification.prototype, "member", void 0);
    Notification = __decorate([
        typeorm_1.Entity("notifications")
    ], Notification);
    return Notification;
}());
exports.default = Notification;
//# sourceMappingURL=Notification.js.map