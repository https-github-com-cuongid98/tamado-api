import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import Hobby from "./Hobby";
import Member from "./Member";

@Entity("member_hobby")
export default class MemberHobby {
  @PrimaryColumn({ type: "int", unsigned: true })
  memberId: number;

  @PrimaryColumn({ type: "int", unsigned: true })
  hobbyId: number;

  @ManyToOne(() => Member)
  @JoinColumn({ name: "memberId" })
  member: Member;

  @ManyToOne(() => Hobby)
  @JoinColumn({ name: "hobbyId" })
  hobby: Hobby;
}
