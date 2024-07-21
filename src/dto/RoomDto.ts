import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";

export enum RoomStatus {
  READY = "ready",
  SCAN = "scan",
  STOP = "stop",
  FINISH = "finish",
}

export class RoomDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @Matches(
    `^${Object.values(RoomStatus)
      .filter((v) => typeof v !== "number")
      .join("|")}$`,
    "i"
  )
  status: RoomStatus;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  secret_key: string;

  @IsNotEmpty()
  @IsNumber()
  group_id: number;

  @IsOptional()
  @IsBoolean()
  active: boolean;
}
