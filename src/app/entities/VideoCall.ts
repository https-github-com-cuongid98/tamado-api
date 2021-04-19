import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import Conversation from "./Conversation";
import { VideoCallStatus } from "$enums";
import Member from "./Member";

@Entity("video_calls")
export default class VideoCall {
  @PrimaryColumn({ type: "bigint", unsigned: true })
  conversationId: number;

  @PrimaryColumn({ type: "int", unsigned: true })
  creatorId: number;

  @PrimaryColumn({ type: "varchar", length: 255 })
  channelName: string;

  @Column({ type: "datetime" })
  startAt: string | Date;

  @Column({ type: "datetime", nullable: true })
  endAt: string | Date;

  @Column({ type: "tinyint", unsigned: true, default: VideoCallStatus.WAITING })
  status: number;

  @CreateDateColumn({ type: "datetime", nullable: true })
  createdDate: Date;

  @ManyToOne(() => Conversation)
  @JoinColumn({ referencedColumnName: "id", name: "conversationId" })
  conversation: Conversation;
}
