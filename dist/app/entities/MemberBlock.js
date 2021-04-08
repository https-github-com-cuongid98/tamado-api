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
var MemberBlock = /** @class */ (function () {
    function MemberBlock() {
    }
    __decorate([
        typeorm_1.PrimaryColumn({ type: "int", unsigned: true }),
        __metadata("design:type", Number)
    ], MemberBlock.prototype, "memberId", void 0);
    __decorate([
        typeorm_1.PrimaryColumn({ type: "int", unique: true }),
        __metadata("design:type", Number)
    ], MemberBlock.prototype, "targetId", void 0);
    __decorate([
        typeorm_1.CreateDateColumn({ type: "datetime", nullable: true }),
        __metadata("design:type", Date)
    ], MemberBlock.prototype, "createdDate", void 0);
    MemberBlock = __decorate([
        typeorm_1.Entity("member_block")
    ], MemberBlock);
    return MemberBlock;
}());
exports.default = MemberBlock;
//# sourceMappingURL=MemberBlock.js.map