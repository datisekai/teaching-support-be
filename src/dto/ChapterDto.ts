import { IsNotEmpty, IsOptional, IsString, IsInt } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateChapterDto {
  @IsInt()
  @IsNotEmpty()
  course_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateChapterDto extends PartialType(CreateChapterDto) {}
