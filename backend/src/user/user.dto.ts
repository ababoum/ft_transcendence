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

export class UpdateEmailDto {
	@IsNotEmpty()
	@IsEmail()
	new_email: string;
}

export class UpdateNicknameDto {

	@IsNotEmpty()
	new_nickname: string;
}

export class UpdatePasswordDto {

	@MinLength(8)
	old_password: string;

	@MinLength(8)
	new_password: string;
}


export class NicknameDTO {

	@MinLength(1)
	nickname: string;
}
