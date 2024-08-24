import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Question } from "./question.entity";

@Entity()
export class DifficultyLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  level: string;
}
