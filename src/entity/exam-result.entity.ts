import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Course } from "./course.entity";
import { Group } from "./group.entity";
import { Question } from "./question.entity";
import { Exam } from "./exam.entity";
import { User } from "./user.entity";

@Entity()
export class ExamResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  exam_id: number;

  @Column("int")
  user_id: number;

  @Column("simple-json")
  answers: any;

  @ManyToOne(() => Exam)
  @JoinColumn({ name: "exam_id" })
  exam: Exam;

  @Column({ type: "datetime", nullable: true })
  end_time: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}
