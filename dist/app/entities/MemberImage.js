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
var MemberImage = /** @class */ (function () {
    function MemberImage() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({ type: "int", unsigned: true }),
        __metadata("design:type", Number)
    ], MemberImage.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column({ type: "int", unsigned: true }),
        __metadata("design:type", Number)
    ], MemberImage.prototype, "memberId", void 0);
    __decorate([
        typeorm_1.Column({ type: "varchar", length: 255 }),
        __metadata("design:type", String)
    ], MemberImage.prototype, "URL", void 0);
    __decorate([
        typeorm_1.CreateDateColumn({ type: "datetime" }),
        __metadata("design:type", Object)
    ], MemberImage.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return Member_1.default; }),
        typeorm_1.JoinColumn({ name: "memberId", referencedColumnName: "id" }),
        __metadata("design:type", Member_1.default)
    ], MemberImage.prototype, "member", void 0);
    MemberImage = __decorate([
        typeorm_1.Entity("member_image")
    ], MemberImage);
    return MemberImage;
}());
exports.default = MemberImage;
//# sourceMappingURL=MemberImage.js.map