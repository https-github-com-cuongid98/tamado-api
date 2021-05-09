import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Job from "./Job";
import Member from "./Member";

@Entity("member_detail")
export default class MemberDetail {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "int", unsigned: true })
  memberId: number;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @Column({ type: "tinyint", unsigned: true, comment: "1.male,2.female" })
  gender: number;

  @Column({ type: "varchar", length: 50 })
  email: string;

  @Column({ type: "date", nullable: true })
  birthday: string | Date;

  @Column({ type: "text", nullable: true })
  introduce: string | null;

  @Column({ type: "int", nullable: true, unsigned: true })
  jobId: number;

  @UpdateDateColumn({ type: "datetime" })
  updateAt: string | Date;

  @CreateDateColumn({ type: "datetime" })
  createdAt: string | Date;

  @OneToOne(() => Member)
  @JoinColumn({ name: "memberId", referencedColumnName: "id" })
  member: Member;

  @ManyToOne(() => Job)
  @JoinColumn({ name: "jobId" })
  job: Job;
}
