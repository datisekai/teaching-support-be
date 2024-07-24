import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
import { User } from "./user.entity";
import { Room } from "./room.entity";

@Entity()
@Unique(["student_id", "room_id", "success"])
export class EventRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  student_id: number;

  @Column("int")
  room_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "student_id" })
  student: User;

  @ManyToOne(() => Room)
  @JoinColumn({ name: "room_id" })
  room: Room;

  @Column("boolean")
  success: boolean; // trạng thái quét QR

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
