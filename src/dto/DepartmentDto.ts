import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class DepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
