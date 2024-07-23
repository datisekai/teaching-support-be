import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Department } from "./department.entity";
import { Group } from "./group.entity";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  name: string;

  @Column("varchar")
  description: string;

  @Column("int")
  department_id: number;

  @ManyToOne(() => Department)
  @JoinColumn({ name: "department_id" })
  department: Department;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false, type: "boolean", select: false })
  is_deleted: Boolean;

  @OneToMany(() => Group, (group) => group.course)
  groups: Group[];
}
