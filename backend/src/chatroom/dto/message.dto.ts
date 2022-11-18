import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class MessageDto {
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(150)
	@IsString()
	@ApiProperty()
	content: string;
}
