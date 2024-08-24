import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsArray,
} from "class-validator";

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsNotEmpty()
  group_id: number;

  @IsInt()
  @IsNotEmpty()
  duration: number;

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  questionIds: number[];
}

export class UpdateExamDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  group_id?: number;

  @IsInt()
  @IsOptional()
  duration?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  questionIds?: number[];
}
