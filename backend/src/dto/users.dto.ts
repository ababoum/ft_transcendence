import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
	@IsNotEmpty()
	@MinLength(3)
	nickname: string;

	@IsNotEmpty()
	@MinLength(2)
	login: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MinLength(8)
	password: string;
};