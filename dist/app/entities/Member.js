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
var MemberDetail_1 = __importDefault(require("./MemberDetail"));
var MemberImage_1 = __importDefault(require("./MemberImage"));
var Notification_1 = __importDefault(require("./Notification"));
var Member = /** @class */ (function () {
    function Member() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({ type: "int", unsigned: true }),
        __metadata("design:type", Number)
    ], Member.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column({ type: "varchar", length: 20 }),
        __metadata("design:type", String)
    ], Member.prototype, "phone", void 0);
    __decorate([
        typeorm_1.Column({ type: "varchar", length: 255 }),
        __metadata("design:type", String)
    ], Member.prototype, "password", void 0);
    __decorate([
        typeorm_1.Column({ type: "varchar", length: 255, nullable: true }),
        __metadata("design:type", String)
    ], Member.prototype, "avatar", void 0);
    __decorate([
        typeorm_1.Column({ type: "tinyint", default: _enums_1.MemberStatus.ACTIVE }),
        __metadata("design:type", Number)
    ], Member.prototype, "status", void 0);
    __decorate([
        typeorm_1.Column({ type: "tinyint", default: _enums_1.ShowLocation.YES }),
        __metadata("design:type", Number)
    ], Member.prototype, "showLocation", void 0);
    __decorate([
        typeorm_1.Index(),
        typeorm_1.Column({
            type: "decimal",
            precision: 22,
            scale: 18,
            comment: "Latitude",
            nullable: true,
        }),
        __metadata("design:type", Number)
    ], Member.prototype, "lat", void 0);
    __decorate([
        typeorm_1.Index(),
        typeorm_1.Column({
            type: "decimal",
            precision: 22,
            scale: 18,
            comment: "Longitude",
            nullable: true,
        }),
        __metadata("design:type", Number)
    ], Member.prototype, "lng", void 0);
    __decorate([
        typeorm_1.Column({
            type: "varchar",
            length: 500,
            default: null,
            comment: "Use this token to request access token. Valid in ~1 month",
        }),
        __metadata("design:type", String)
    ], Member.prototype, "refreshToken", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn({ type: "datetime" }),
        __metadata("design:type", Object)
    ], Member.prototype, "updateAt", void 0);
    __decorate([
        typeorm_1.CreateDateColumn({ type: "datetime" }),
        __metadata("design:type", Object)
    ], Member.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.OneToOne(function () { return MemberDetail_1.default; }, function (memberDetail) { return memberDetail.member; }),
        __metadata("design:type", MemberDetail_1.default)
    ], Member.prototype, "memberDetail", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return Notification_1.default; }, function (notification) { return notification.member; }),
        __metadata("design:type", Notification_1.default)
    ], Member.prototype, "notification", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return MemberImage_1.default; }, function (memberImage) { return memberImage.member; }),
        __metadata("design:type", MemberImage_1.default)
    ], Member.prototype, "memberImage", void 0);
    Member = __decorate([
        typeorm_1.Entity("members")
    ], Member);
    return Member;
}());
exports.default = Member;
//# sourceMappingURL=Member.js.map