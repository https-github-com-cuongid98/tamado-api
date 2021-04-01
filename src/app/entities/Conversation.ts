import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import ConversationMember from "./ConversationMember";
import { ConversationType } from "$enums";

@Entity("conversations")
export default class Conversation {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: number;

  @Column({ type: "text", nullable: true })
  lastMessage: string;

  @Column({ type: "varchar", nullable: true })
  channelName: string;

  @Column({ type: "tinyint", unsigned: true, default: ConversationType.PERSON })
  conversationType: number;

  @Column({ type: "tinyint", nullable: true })
  lastMessageType: number;

  @Column({ type: "bigint", unsigned: true, nullable: true })
  lastSentMemberId: number;

  @Column({ type: "datetime", nullable: true })
  lastTimeSent: string | Date | null;

  @CreateDateColumn({ type: "datetime", nullable: true })
  createdDate: Date;

  @OneToMany(
    () => ConversationMember,
    (conversationMember) => conversationMember.conversation
  )
  conversationMember: ConversationMember[];
}
