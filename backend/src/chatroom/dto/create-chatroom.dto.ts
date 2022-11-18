import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { chatRoomType } from '@prisma/client';
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateChatRoomDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @IsString()
  @Matches(/^[A-Za-z0-9_@.-]*$/)
  @ApiProperty()
  name: string;
 
  @IsOptional()
  @IsEnum(chatRoomType)
  @ApiPropertyOptional({default: "PUBLIC" })
  mode?: chatRoomType;

  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[A-Za-z0-9_@.-]*$/)
  @ApiPropertyOptional()
  password?: string;
}
