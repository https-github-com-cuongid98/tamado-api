import { CommonStatus } from "$enums";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import MemberDetail from "./MemberDetail";
import MemberHobby from "./MemberHobby";

@Entity("jobs")
export default class Job {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 255 })
  jobName: string;

  @Column({ type: "tinyint", default: CommonStatus.ACTIVE })
  status: number;

  @CreateDateColumn({ type: "datetime" })
  createdDate: Date | string;

  @OneToMany(() => MemberDetail, (memberDetail) => memberDetail.job)
  memberDetails: MemberDetail[];
}
