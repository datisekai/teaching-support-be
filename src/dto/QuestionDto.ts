import { IsString, IsNotEmpty, IsOptional, IsInt } from "class-validator";

export class CreateQuestionDto {
  @IsInt()
  @IsNotEmpty()
  course_id: number;

  @IsInt()
  @IsNotEmpty()
  chapter_id: number;

  @IsInt()
  @IsNotEmpty()
  difficulty_id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  correct_answer: string;

  @IsString()
  @IsNotEmpty()
  option_a: string;

  @IsString()
  @IsNotEmpty()
  option_b: string;

  @IsString()
  @IsNotEmpty()
  option_c: string;

  @IsString()
  @IsNotEmpty()
  option_d: string;
}

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  correct_answer?: string;

  @IsString()
  @IsOptional()
  option_a?: string;

  @IsString()
  @IsOptional()
  option_b?: string;

  @IsString()
  @IsOptional()
  option_c?: string;

  @IsString()
  @IsOptional()
  option_d?: string;
}
