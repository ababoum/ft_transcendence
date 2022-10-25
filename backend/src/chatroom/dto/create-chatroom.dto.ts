import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @MinLength(6)
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
