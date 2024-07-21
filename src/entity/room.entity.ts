import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Group } from "./group.entity";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  title: string;

  @Column("varchar")
  description: string;

  @Column("varchar")
  secret_key: string;

  @Column("int")
  owner_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "owner_id" })
  owner: User;

  @Column("int")
  group_id: number;

  @ManyToOne(() => Group)
  @JoinColumn({ name: "group_id" })
  group: Group;

  @Column({ default: true, type: "boolean" })
  active: boolean;

  @Column({
    type: "enum",
    enum: ["ready", "scan", "stop", "finish"],
  })
  status: string;

  @Column("bigint")
  duration: number; // milisecond

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false, type: "boolean", select: false })
  is_deleted: Boolean;
}
