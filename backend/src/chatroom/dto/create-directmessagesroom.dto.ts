import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { chatRoomType } from '@prisma/client';
import {
	IsAlphanumeric,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateDirectMessagesRoomDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  @IsString()
  @Matches(/^[ A-Za-z0-9_@.-]*$/)
  @ApiProperty()
  nickname: string;
}
