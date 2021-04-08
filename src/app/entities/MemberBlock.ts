import { CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity("member_block")
export default class MemberBlock {
  @PrimaryColumn({ type: "int", unsigned: true })
  memberId: number;

  @PrimaryColumn({ type: "int", unique: true })
  targetId: number;

  @CreateDateColumn({ type: "datetime", nullable: true })
  createdDate: Date;
}
