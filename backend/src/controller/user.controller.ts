import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Delete,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User as UserModel } from '@prisma/client';


@Controller('users')
export class UserController {

	constructor(private readonly userService: UserService) { }


	@Get('id/:id')
	async getUserById(@Param('id') id: string): Promise<UserModel> {
		return this.userService.user({ id: Number(id) });
	}

	@Get()
	findUsersById() {
		return this.userService.users({});
	}

	@Post('create')
	async signupUser(
		@Body() userData: { login: string; email: string; nickname: string, password: string },
	): Promise<UserModel> {
		return this.userService.createUser(userData);
	}

	@Delete('id/:id')
	async deletePost(@Param('id') id: string): Promise<UserModel> {
		return this.userService.deleteUser({ id: Number(id) });
	}
}