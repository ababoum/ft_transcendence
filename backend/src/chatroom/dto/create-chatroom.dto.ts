import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { chatRoomType } from '@prisma/client';
import {
	IsAlphanumeric,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateChatRoomDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @IsString()
  @IsAlphanumeric()
  @ApiProperty()
  name: string;
 
  @IsOptional()
  @IsEnum(chatRoomType)
  @ApiPropertyOptional({default: "PUBLIC" })
  mode?: chatRoomType;

  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  @ApiPropertyOptional()
  password?: string;
}
