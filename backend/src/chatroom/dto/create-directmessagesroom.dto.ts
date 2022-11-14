import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { chatRoomType } from '@prisma/client';
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateDirectMessagesRoomDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  @IsString()
  @ApiProperty()
  nickname: string;
}
