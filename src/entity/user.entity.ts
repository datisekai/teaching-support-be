import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";

@Entity()
@Unique(["code", "device_uid"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true })
  code: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar", select: false, nullable: true })
  password: string;

  @Column({ type: "varchar", nullable: true })
  phone: string;

  @Column({
    type: "varchar",
  })
  role: string;

  @Column({ type: "boolean", default: true })
  active: boolean;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar", nullable: true })
  avatar: string;

  @Column({
    type: "varchar",
    nullable: true,
  })
  device_uid: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false, type: "boolean", select: false })
  is_deleted: Boolean;
}
