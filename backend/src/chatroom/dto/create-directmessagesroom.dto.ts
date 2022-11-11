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
  @ApiProperty()
  nickname: string;
}
