import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity("configs")
export default class Config {
  @PrimaryColumn({ type: "varchar", name: "key", length: 200 })
  key: string;

  @Column({ type: "varchar", name: "name", length: 255 })
  name: string;

  @Column({ type: "text" })
  value: string;

  @Column({ type: "varchar", nullable: true, length: 50 })
  type: string | null;

  @Column({ type: "text", nullable: true })
  metadata: string | null;

  @Column({ type: "tinyint", nullable: true })
  order: number | null;

  @Column({ type: "tinyint", nullable: true })
  isSystem: number | null;

  @Column({ type: "bigint", nullable: true, unsigned: true })
  createdBy: number | null;

  @CreateDateColumn({ type: "datetime" })
  createdAt: string | Date;
}
