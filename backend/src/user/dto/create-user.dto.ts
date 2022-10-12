import { ApiProperty } from '@nestjs/swagger';
import { chatRoomType } from '@prisma/client';
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  login: string;

  @IsNotEmpty()
  @ApiProperty()
  nickname: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsOptional()
  @ApiProperty()
  password: string;
}