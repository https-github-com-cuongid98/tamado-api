import { MemberType, IsCalling } from "$enums";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import Conversation from "./Conversation";

@Entity("conversation_member")
export default class ConversationMember {
  @PrimaryColumn({ type: "bigint", unsigned: true })
  conversationId: number;

  @PrimaryColumn({ type: "int", unique: true })
  memberId: number;

  @Column({
    type: "tinyint",
    default: MemberType.APP,
  })
  memberType: number;

  @Column({
    type: "tinyint",
    nullable: true,
    default: 1,
    comment: "0: not read, 1. read",
  })
  isRead: number;

  @Column({ type: "varchar", nullable: true, length: 255 })
  agoraToken: string;

  @Column({ type: "tinyint", default: IsCalling.NO })
  isCalling: number;

  @Column({ type: "bigint", nullable: true })
  lastReadTime: number;

  @CreateDateColumn({ type: "datetime", nullable: true })
  createdDate: Date;

  @ManyToOne(() => Conversation)
  @JoinColumn({ name: "conversationId" })
  conversation: Conversation;
}
