import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  department_id: number;

  @IsNotEmpty()
  @IsString()
  code: string;
}
