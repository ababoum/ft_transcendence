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
	@MinLength(1)
	@IsString()
	@ApiProperty()
	content: string;
}
