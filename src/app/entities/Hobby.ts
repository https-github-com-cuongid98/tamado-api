import { CommonStatus } from "$enums";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import MemberHobby from "./MemberHobby";

@Entity("hobbies")
export default class Hobby {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 255 })
  hobby: string;

  @Column({ type: "tinyint", default: CommonStatus.ACTIVE })
  status: number;

  @CreateDateColumn({ type: "datetime" })
  createdDate: Date | string;

  @OneToMany(() => MemberHobby, (memberHobby) => memberHobby.hobby)
  memberHobbies: MemberHobby[];
}
