import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Course } from "./course.entity";

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  name: string;

  @Column("text")
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false, type: "boolean", select: false })
  is_deleted: Boolean;

  @OneToMany(() => Course, (course) => course.department)
  courses: Course[];
}
