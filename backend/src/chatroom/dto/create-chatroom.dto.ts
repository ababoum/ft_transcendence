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

export class CreateChatRoomDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @ApiProperty()
  name: string;
 
  @IsOptional()
  @IsEnum(chatRoomType)
  @ApiPropertyOptional({default: "PUBLIC" })
  mode?: chatRoomType;

  @IsOptional()
  @MinLength(3)
  @ApiPropertyOptional()
  password?: string;
}
