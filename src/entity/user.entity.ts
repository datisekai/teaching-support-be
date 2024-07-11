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
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true })
  code: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar", select: false })
  password: string;

  @Column({ type: "varchar", nullable: true })
  phone: string;

  @Column({
    type: "enum",
    enum: ["admin", "teacher", "student"],
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
    unique: true,
    nullable: true,
  })
  device_uid: string;

  @Column({
    select: false,
    nullable: true,
    type: "varchar",
  })
  salt: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false, type: "boolean", select: false })
  is_deleted: Boolean;
}
