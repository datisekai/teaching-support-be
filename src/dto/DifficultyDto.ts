import { IsNotEmpty, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateDifficultyLevelDto {
  @IsString()
  @IsNotEmpty()
  level: string;
}

export class UpdateDifficultyLevelDto extends PartialType(
  CreateDifficultyLevelDto
) {}
