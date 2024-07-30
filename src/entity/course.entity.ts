import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  AfterUpdate,
} from "typeorm";
import { User } from "./user.entity";
import { Department } from "./department.entity";
import { Group } from "./group.entity";
import { myDataSource } from "../app-data-source";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true, type: "varchar" })
  code: string;

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

  @AfterUpdate()
  async afterUpdate() {
    if (this.is_deleted) {
      const groupRepository = myDataSource.getRepository(Group);
      await groupRepository.update({ course: this }, { is_deleted: true });
    }
  }
}
