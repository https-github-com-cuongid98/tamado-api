import { CommonStatus, IsRead } from "$enums";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Member from "./Member";

@Entity("notifications")
export default class Notification {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "int", unsigned: true })
  memberId: number;

  @Column({ type: "int" })
  redirectType: number;

  @Column({ type: "int" })
  redirectId: number;

  @Column({
    type: "tinyint",
    default: IsRead.UN_SEEN,
  })
  isRead: number;

  @Column({
    type: "tinyint",
    default: CommonStatus.ACTIVE,
  })
  status: number;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "text" })
  metaData: string;

  @CreateDateColumn({ type: "datetime", nullable: true })
  createdDate: Date;

  @ManyToOne(() => Member)
  @JoinColumn({ referencedColumnName: "id", name: "memberId" })
  member: Member;
}
