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
var typeorm_1 = require("typeorm");
var Member_1 = __importDefault(require("./Member"));
var MemberDetail = /** @class */ (function () {
    function MemberDetail() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({ type: "int", unsigned: true }),
        __metadata("design:type", Number)
    ], MemberDetail.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column({ type: "int", unsigned: true }),
        __metadata("design:type", Number)
    ], MemberDetail.prototype, "memberId", void 0);
    __decorate([
        typeorm_1.Column({ type: "varchar", length: 50 }),
        __metadata("design:type", String)
    ], MemberDetail.prototype, "name", void 0);
    __decorate([
        typeorm_1.Column({ type: "varchar", length: 50 }),
        __metadata("design:type", String)
    ], MemberDetail.prototype, "email", void 0);
    __decorate([
        typeorm_1.Column({ type: "date", nullable: true }),
        __metadata("design:type", Object)
    ], MemberDetail.prototype, "birthday", void 0);
    __decorate([
        typeorm_1.Column({ type: "text", nullable: true }),
        __metadata("design:type", String)
    ], MemberDetail.prototype, "introduce", void 0);
    __decorate([
        typeorm_1.Column({ type: "text", nullable: true }),
        __metadata("design:type", String)
    ], MemberDetail.prototype, "hobby", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn({ type: "datetime" }),
        __metadata("design:type", Object)
    ], MemberDetail.prototype, "updateAt", void 0);
    __decorate([
        typeorm_1.CreateDateColumn({ type: "datetime" }),
        __metadata("design:type", Object)
    ], MemberDetail.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.OneToOne(function () { return Member_1.default; }),
        typeorm_1.JoinColumn({ name: "memberId", referencedColumnName: "id" }),
        __metadata("design:type", Member_1.default)
    ], MemberDetail.prototype, "member", void 0);
    MemberDetail = __decorate([
        typeorm_1.Entity("member_detail")
    ], MemberDetail);
    return MemberDetail;
}());
exports.default = MemberDetail;
//# sourceMappingURL=MemberDetail.js.map