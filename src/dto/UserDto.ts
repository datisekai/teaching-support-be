import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

export enum UserRole {
  ADMIN = "ADMIN",
  STUDENT = "SINHVIEN",
  TEACHER = "GIANGVIEN",
}

export class UserDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @Matches(/^\+?84?(\s?|\-?)?(0[3|5|7|8|9])+([0-9]{8})$/, {
    message: "Phone number is invalid",
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  device_uid: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsString()
  @IsEnum(UserRole)
  role: UserRole;
}
