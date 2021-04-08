import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Member from "./Member";

@Entity("member_image")
export default class MemberImage {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "int", unsigned: true })
  memberId: number;

  @Column({ type: "varchar", length: 255 })
  URL: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt: string | Date;

  @ManyToOne(() => Member)
  @JoinColumn({ name: "memberId", referencedColumnName: "id" })
  member: Member;
}
