import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class GroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  course_id: number;

  @IsNotEmpty()
  @IsNumber()
  teacher_id: number;

  @IsNotEmpty()
  @IsString()
  due_date: string;
}
