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
import { User, User as UserModel } from '@prisma/client';
import { Friend as FriendModel } from '@prisma/client';


@Controller('users')
export class UserController {

	constructor(private readonly userService: UserService) { }


	@Get('id/:id')
	async getUserById(@Param('id') id: string): Promise<UserModel> {
		return this.userService.user({ id: Number(id) });
	}

	@Get()
	async findUsersById(): Promise<UserModel[]> {
		return this.userService.users({});
	}

	@Post('create')
	async signupUser(
		@Body() userData: { login: string; email: string; nickname: string, password: string },
	): Promise<UserModel> {
		return this.userService.createUser(userData);
	}

	@Delete('id/:id')
	async deleteUser(@Param('id') id: string): Promise<UserModel> {
		return this.userService.deleteUser({ id: Number(id) });
	}

	@Post('add_friend/:userId/:friendId')
	async addFriend(@Param('userId') userId: string, @Param('friendId') friendId: string)
	: Promise<UserModel[]> {

		let ret: UserModel[] = [];

		ret.push(await this.userService.addFriend(Number(userId), Number(friendId)));
		ret.push(await this.userService.addFriend(Number(friendId), Number(userId)));

		return ret;
	}
	
	@Get('/friends/:userId')
	async getFriendsList(@Param('userId') userId: string)
	: Promise<UserModel[]> 
	{
		return this.userService.friends(Number(userId));
	}

	@Delete('/friendship/:userId/:friendId')
	async deleteFriend(@Param('userId') userId: string, @Param('friendId') friendId: string)
	{
		return this.userService.deleteFriend(Number(userId), Number(friendId));
	}

}