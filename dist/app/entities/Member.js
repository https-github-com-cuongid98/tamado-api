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
var Member = /** @class */ (function () {
    function Member() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true }),
        __metadata("design:type", Number)
    ], Member.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column({ name: 'email', type: 'varchar', length: 100, unique: true }),
        __metadata("design:type", String)
    ], Member.prototype, "email", void 0);
    __decorate([
        typeorm_1.Column({ name: 'password', type: 'text' }),
        __metadata("design:type", String)
    ], Member.prototype, "password", void 0);
    __decorate([
        typeorm_1.Column({ name: 'full_name', type: 'varchar', length: 255, nullable: true }),
        __metadata("design:type", String)
    ], Member.prototype, "fullName", void 0);
    __decorate([
        typeorm_1.Column({ name: 'mobile', type: 'varchar', length: 20, nullable: true }),
        __metadata("design:type", String)
    ], Member.prototype, "mobile", void 0);
    __decorate([
        typeorm_1.Column({ name: 'avatar', type: 'varchar', length: 255, nullable: true }),
        __metadata("design:type", String)
    ], Member.prototype, "avatar", void 0);
    __decorate([
        typeorm_1.Column({ name: 'status', type: 'tinyint', default: _enums_1.MemberStatus.ACTIVE, comment: '0: Inactive, 1: Active.' }),
        __metadata("design:type", Number)
    ], Member.prototype, "status", void 0);
    __decorate([
        typeorm_1.CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true }),
        __metadata("design:type", Date)
    ], Member.prototype, "createdDate", void 0);
    __decorate([
        typeorm_1.Column({ name: 'last_logged', type: 'datetime', nullable: true }),
        __metadata("design:type", Date)
    ], Member.prototype, "lastLogged", void 0);
    __decorate([
        typeorm_1.Column({ name: 'last_change_pass', type: 'datetime', nullable: true }),
        __metadata("design:type", Date)
    ], Member.prototype, "lastChangePass", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true }),
        __metadata("design:type", Date)
    ], Member.prototype, "modifiedDate", void 0);
    __decorate([
        typeorm_1.Column({ name: 'refresh_token', type: 'text', nullable: true }),
        __metadata("design:type", String)
    ], Member.prototype, "refreshToken", void 0);
    Member = __decorate([
        typeorm_1.Entity('member')
    ], Member);
    return Member;
}());
exports.default = Member;
//# sourceMappingURL=Member.js.map