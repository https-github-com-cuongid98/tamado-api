import { CommonStatus, MemberStatus, ShowLocation } from "$enums";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import MemberDetail from "./MemberDetail";
import MemberHobby from "./MemberHobby";
import MemberImage from "./MemberImage";
import Notification from "./Notification";

@Entity("members")
export default class Member {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 20 })
  phone: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  avatar: string | null;

  @Column({ type: "tinyint", default: MemberStatus.ACTIVE })
  status: number;

  @Column({ type: "tinyint", default: ShowLocation.YES })
  showLocation: number;

  @Column({ type: "tinyint", default: CommonStatus.ACTIVE })
  receiveNotification: number;

  @Index()
  @Column({
    type: "decimal",
    precision: 22,
    scale: 18,
    comment: "Latitude",
    nullable: true,
  })
  lat: number;

  @Index()
  @Column({
    type: "decimal",
    precision: 22,
    scale: 18,
    comment: "Longitude",
    nullable: true,
  })
  lng: number;

  @Column({
    type: "varchar",
    length: 500,
    default: null,
    comment: "Use this token to request access token. Valid in ~1 month",
  })
  refreshToken: string;

  @UpdateDateColumn({ type: "datetime" })
  updateAt: string | Date;

  @CreateDateColumn({ type: "datetime" })
  createdAt: string | Date;

  @OneToOne(() => MemberDetail, (memberDetail) => memberDetail.member)
  memberDetail: MemberDetail;

  @OneToMany(() => Notification, (notification) => notification.member)
  notification: Notification;

  @OneToMany(() => MemberImage, (memberImage) => memberImage.member)
  memberImages: MemberImage[];

  @OneToMany(() => MemberHobby, (memberHobby) => memberHobby.member)
  memberHobbies: MemberHobby[];
}
