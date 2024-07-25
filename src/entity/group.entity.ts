import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  AfterUpdate,
} from "typeorm";
import { Course } from "./course.entity";
import { User } from "./user.entity";
import { Room } from "./room.entity";
import { myDataSource } from "../app-data-source";

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  course_id: number;

  @ManyToOne(() => Course)
  @JoinColumn({ name: "course_id" })
  course: Course;

  @Column("int")
  teacher_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "teacher_id" })
  teacher: User;

  @Column("varchar")
  name: string;

  @Column("varchar")
  due_date: string;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false, type: "boolean", select: false })
  is_deleted: Boolean;

  @OneToMany(() => Room, (room) => room.group)
  rooms: Room[];

  @AfterUpdate()
  async afterUpdate() {
    if (this.is_deleted) {
      const roomRepository = myDataSource.getRepository(Room);
      await roomRepository.update(
        { group: this },
        { is_deleted: true, active: false }
      );
    }
  }
}
