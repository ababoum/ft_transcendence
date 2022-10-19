import { ApiProperty } from '@nestjs/swagger';
import { chatRoomType } from '@prisma/client';
import {
	IsEmail,
	IsNotEmpty,
	MinLength,
} from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@ApiProperty()
	login: string;

	@IsNotEmpty()
	@ApiProperty()
	nickname: string;

	@IsNotEmpty()
	@IsEmail()
	@ApiProperty()
	email: string;

	@MinLength(8)
	@ApiProperty()
	password: string;
}

export class DeleteUserDto {
	
}
