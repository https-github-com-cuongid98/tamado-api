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
var _enums_1 = require("$enums");
var typeorm_1 = require("typeorm");
var VerifiedCode = /** @class */ (function () {
    function VerifiedCode() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({ type: 'bigint', name: 'id' }),
        __metadata("design:type", Number)
    ], VerifiedCode.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column('varchar', { name: 'target', length: 255, comment: "user's email or phone " }),
        __metadata("design:type", String)
    ], VerifiedCode.prototype, "target", void 0);
    __decorate([
        typeorm_1.Column('varchar', { name: 'code', length: 20 }),
        __metadata("design:type", String)
    ], VerifiedCode.prototype, "code", void 0);
    __decorate([
        typeorm_1.Column('tinyint', {
            name: 'status',
            comment: '1: unused, 2: used',
            default: _enums_1.VerifiedCodeStatus.UNUSED,
        }),
        __metadata("design:type", Number)
    ], VerifiedCode.prototype, "status", void 0);
    __decorate([
        typeorm_1.Column('timestamp', { name: 'verified_date', nullable: true }),
        __metadata("design:type", Date)
    ], VerifiedCode.prototype, "verifiedDate", void 0);
    __decorate([
        typeorm_1.Column('timestamp', { name: 'expired_date', nullable: true }),
        __metadata("design:type", Date)
    ], VerifiedCode.prototype, "expiredDate", void 0);
    __decorate([
        typeorm_1.CreateDateColumn({ type: 'timestamp', name: 'created_date', nullable: true }),
        __metadata("design:type", Date)
    ], VerifiedCode.prototype, "createdDate", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn({ type: 'timestamp', name: 'modified_date', nullable: true }),
        __metadata("design:type", Date)
    ], VerifiedCode.prototype, "modifiedDate", void 0);
    VerifiedCode = __decorate([
        typeorm_1.Entity('verified_code')
    ], VerifiedCode);
    return VerifiedCode;
}());
exports.default = VerifiedCode;
//# sourceMappingURL=VerifiedCode.js.map