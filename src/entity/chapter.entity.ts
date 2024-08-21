import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Course } from "./course.entity";

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  course_id: number;

  @ManyToOne(() => Course)
  @JoinColumn({ name: "course_id" })
  course: Course;

  @Column("varchar")
  name: string;

  @Column({ nullable: true, type: "varchar" })
  description: string;
}
