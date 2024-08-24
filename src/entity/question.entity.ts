import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Course } from "./course.entity";
import { Chapter } from "./chapter.entity";
import { DifficultyLevel } from "./difficulty.entity";
import { Exam } from "./exam.entity";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  course_id: number;

  @ManyToOne(() => Course)
  @JoinColumn({ name: "course_id" })
  course: Course;

  @Column("int")
  chapter_id: number;

  @ManyToOne(() => Chapter)
  @JoinColumn({ name: "chapter_id" })
  chapter: Chapter;

  @Column("int")
  difficulty_id: number;

  @ManyToOne(() => DifficultyLevel)
  @JoinColumn({ name: "difficulty_id" })
  difficulty: DifficultyLevel;

  @Column("text")
  content: string;

  @Column({ type: "varchar", select: false })
  correct_answer: string;

  @Column("varchar")
  option_a: string;

  @Column("varchar")
  option_b: string;

  @Column("varchar")
  option_c: string;

  @Column("varchar")
  option_d: string;
}
