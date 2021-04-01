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
var Conversation_1 = __importDefault(require("./Conversation"));
var ConversationMember = /** @class */ (function () {
    function ConversationMember() {
    }
    __decorate([
        typeorm_1.PrimaryColumn({ type: "bigint", unsigned: true }),
        __metadata("design:type", Number)
    ], ConversationMember.prototype, "conversationId", void 0);
    __decorate([
        typeorm_1.PrimaryColumn({ type: "int", unique: true }),
        __metadata("design:type", String)
    ], ConversationMember.prototype, "memberId", void 0);
    __decorate([
        typeorm_1.PrimaryColumn({
            type: "tinyint",
            default: _enums_1.ConversationMemberType.MEMBER,
            comment: "1: member, 2: Admin",
        }),
        __metadata("design:type", Number)
    ], ConversationMember.prototype, "memberType", void 0);
    __decorate([
        typeorm_1.Column({
            type: "tinyint",
            nullable: true,
            default: 1,
            comment: "0: not read, 1. read",
        }),
        __metadata("design:type", Number)
    ], ConversationMember.prototype, "isRead", void 0);
    __decorate([
        typeorm_1.Column({ type: "varchar", nullable: true, length: 255 }),
        __metadata("design:type", String)
    ], ConversationMember.prototype, "agoraToken", void 0);
    __decorate([
        typeorm_1.Column({ type: "bigint", nullable: true }),
        __metadata("design:type", Number)
    ], ConversationMember.prototype, "lastReadTime", void 0);
    __decorate([
        typeorm_1.CreateDateColumn({ type: "datetime", nullable: true }),
        __metadata("design:type", Date)
    ], ConversationMember.prototype, "createdDate", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return Conversation_1.default; }),
        typeorm_1.JoinColumn({ referencedColumnName: "id", name: "conversationId" }),
        __metadata("design:type", Conversation_1.default)
    ], ConversationMember.prototype, "conversation", void 0);
    ConversationMember = __decorate([
        typeorm_1.Entity("conversation_member")
    ], ConversationMember);
    return ConversationMember;
}());
exports.default = ConversationMember;
//# sourceMappingURL=ConversationMember.js.map