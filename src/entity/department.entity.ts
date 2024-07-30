import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  AfterUpdate,
} from "typeorm";
import { Course } from "./course.entity";
import { myDataSource } from "../app-data-source";

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false, type: "boolean", select: false })
  is_deleted: Boolean;

  @OneToMany(() => Course, (course) => course.department)
  courses: Course[];

  @AfterUpdate()
  async afterUpdate() {
    if (this.is_deleted) {
      const courseRepository = myDataSource.getRepository(Course);
      await courseRepository.update({ department: this }, { is_deleted: true });
    }
  }
}
