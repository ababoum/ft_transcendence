import { ApiProperty } from '@nestjs/swagger';
import { chatRoomType } from '@prisma/client';
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator';

export class CreateChatRoomDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  name: string;
 
  @IsOptional()
  @IsEnum(chatRoomType)
  @ApiProperty({ required: false, default: "PUBLIC" })
  mode?: chatRoomType;

  @IsOptional()
  @MinLength(3)
  @ApiProperty({required: false})
  password?: string;
}
