import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
	@IsNotEmpty()
	@ApiProperty()
	login: string;

	@IsNotEmpty()
	@ApiProperty()
	password: string;
}