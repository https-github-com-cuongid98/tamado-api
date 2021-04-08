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
var MemberFollow = /** @class */ (function () {
    function MemberFollow() {
    }
    __decorate([
        typeorm_1.PrimaryColumn({ type: "int", unsigned: true }),
        __metadata("design:type", Number)
    ], MemberFollow.prototype, "memberId", void 0);
    __decorate([
        typeorm_1.PrimaryColumn({ type: "int", unique: true }),
        __metadata("design:type", Number)
    ], MemberFollow.prototype, "targetId", void 0);
    __decorate([
        typeorm_1.CreateDateColumn({ type: "datetime", nullable: true }),
        __metadata("design:type", Date)
    ], MemberFollow.prototype, "createdDate", void 0);
    MemberFollow = __decorate([
        typeorm_1.Entity("member_follow")
    ], MemberFollow);
    return MemberFollow;
}());
exports.default = MemberFollow;
//# sourceMappingURL=MemberFollow.js.map