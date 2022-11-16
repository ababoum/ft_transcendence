import { ApiProperty } from '@nestjs/swagger';
import { chatRoomType } from '@prisma/client';
import {
	IsAlphanumeric,
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
} from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@ApiProperty()
	@IsAlphanumeric()
	login: string;

	@IsNotEmpty()
	@ApiProperty()
	@IsAlphanumeric()
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
	@ApiProperty()
	new_email: string;
}

export class UpdateNicknameDto {

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	@IsAlphanumeric()
	new_nickname: string;
}

export class UpdatePasswordDto {

	@MinLength(8)
	@ApiProperty()
	old_password: string;

	@MinLength(8)
	@ApiProperty()
	new_password: string;
}


export class NicknameDTO {

	@MinLength(1)
	@ApiProperty()
	@IsAlphanumeric()
	nickname: string;
}
