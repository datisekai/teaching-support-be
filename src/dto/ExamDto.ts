import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsArray,
  IsNumber,
  IsIn,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

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

  @IsOptional()
  @IsNumber()
  code: number;
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

class Answer {
  @IsString()
  @IsNotEmpty()
  @IsIn(["option_a", "option_b", "option_c", "option_d"])
  value: string;
}

export class AnswersDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Answer)
  answers: { [key: number]: Answer };
}
