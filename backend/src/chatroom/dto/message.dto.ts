import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsNumber,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class MessageDto {
	@IsNotEmpty()
	@IsNumber()
	@ApiProperty()
	chatRoomId: string;

	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(1)
	@IsString()
	@ApiProperty()
	content: string;
}
