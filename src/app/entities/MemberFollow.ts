import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import Member from "./Member";

@Entity("member_follow")
export default class MemberFollow {
  @PrimaryColumn({ type: "int", unsigned: true })
  memberId: number;

  @PrimaryColumn({ type: "int", unique: true })
  targetId: number;

  @CreateDateColumn({ type: "datetime", nullable: true })
  createdDate: Date;
}
