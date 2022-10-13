import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
	@IsNotEmpty()
	@MinLength(20)
	@ApiProperty()
	login: string;

	@IsNotEmpty()
	@ApiProperty()
	password: string;
}