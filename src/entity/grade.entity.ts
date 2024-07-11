import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Group } from "./group.entity";
import { User } from "./user.entity";

@Entity()
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  group_id: number;

  @ManyToOne(() => Group)
  @JoinColumn({ name: "group_id" })
  group: Group;

  @Column("int")
  percent: number; // 0 - 100

  @Column("int")
  point: number;

  @Column("int")
  student_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "student_id" })
  student: Group;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false, type: "boolean", select: false })
  is_deleted: Boolean;
}
