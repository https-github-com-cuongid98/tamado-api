import { VerifiedCodeStatus } from "$enums";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("verified_codes")
export default class VerifiedCode {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "varchar", length: 255, comment: "user's email or phone " })
  phone: string;

  @Column({ type: "varchar", length: 20 })
  code: string;

  @Column({ type: "smallint", unsigned: true, default: 0 })
  retry: number;

  @Column({
    type: "tinyint",
    comment: "1: unused, 2: used",
    default: VerifiedCodeStatus.UN_USED,
  })
  status: number;

  @Column({ type: "timestamp", nullable: true })
  verifiedDate: Date | null;

  @Column({ type: "timestamp", nullable: true })
  expiredDate: Date | null;

  @CreateDateColumn({ type: "timestamp" })
  createdDate: Date | null;

  @UpdateDateColumn({ type: "timestamp" })
  modifiedDate: Date | null;
}
