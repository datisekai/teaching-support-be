import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
  Unique,
} from "typeorm";
import { Course } from "./course.entity";
import { Group } from "./group.entity";
import { Question } from "./question.entity";

@Entity()
@Unique(["code"])
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  title: string;

  @Column("int")
  code: number;

  @Column({ nullable: true, type: "varchar" })
  description: string;

  @Column("int")
  group_id: number;

  @ManyToOne(() => Group)
  @JoinColumn({ name: "group_id" })
  group: Group;

  @Column("int")
  duration: number;

  @ManyToMany(() => Question)
  @JoinTable()
  questions: Question[];

  @Column({ type: "datetime", nullable: true })
  start_date: string;
}
