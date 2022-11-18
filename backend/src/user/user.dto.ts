import { ApiProperty } from '@nestjs/swagger';
import { chatRoomType } from '@prisma/client';
import {
	IsAlphanumeric,
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@ApiProperty()
	@MinLength(1)
	@MaxLength(150)
	@Matches(/^[A-Za-z0-9_@.-]*$/)
	login: string;

	@IsNotEmpty()
	@ApiProperty()
	@MinLength(1)
	@MaxLength(150)
	@Matches(/^[A-Za-z0-9_@.-]*$/)
	nickname: string;

	@IsNotEmpty()
	@IsEmail()
	@MinLength(1)
	@MaxLength(150)
	@ApiProperty()
	email: string;

	@MinLength(8)
	@MaxLength(150)
	@ApiProperty()
	password: string;
}

export class UpdateEmailDto {
	@IsNotEmpty()
	@IsEmail()
	@MinLength(1)
	@MaxLength(150)
	@ApiProperty()
	new_email: string;
}

export class UpdateNicknameDto {

	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	@MaxLength(150)
	@ApiProperty()
	@Matches(/^[A-Za-z0-9_@.-]*$/)
	new_nickname: string;
}

export class UpdatePasswordDto {

	@MinLength(8)
	@MaxLength(150)
	@ApiProperty()
	old_password: string;

	@MinLength(8)
	@MaxLength(150)
	@ApiProperty()
	new_password: string;
}


export class NicknameDTO {

	@MinLength(1)
	@MaxLength(150)
	@ApiProperty()
	@Matches(/^[A-Za-z0-9_@.-]*$/)
	nickname: string;
}
