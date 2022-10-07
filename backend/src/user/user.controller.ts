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
import { UserService } from './user.service';
import { Friend, User as UserModel } from '@prisma/client';
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
		@Body() userData: { login: string; email: string; nickname: string, password: string })
	: Promise<UserModel> {
		return this.userService.createUser(userData);
	}

	@Delete('id/:id')
	async deleteUser(@Param('id') id: string): Promise<UserModel> {
		return this.userService.deleteUser({ id: Number(id) });
	}

	@Post('add_friend')
	async addFriend(
		@Body() friendData: {userId: string; friendId: string} )
	: Promise<FriendModel[]> {
		return [
			await this.userService.addFriend(
				Number(friendData.userId),
				Number(friendData.friendId)),
			await this.userService.addFriend(
				Number(friendData.friendId),
				Number(friendData.userId))
		]
	}
	
	@Get('/friends/:userId')
	async getFriendsList(@Param('userId') userId: string)
	: Promise<UserModel[]> 
	{
		return this.userService.friends(Number(userId));
	}

	@Delete('/friends')
	async deleteFriend(
		@Body() friendData: {userId: string; friendId: string} )
	{
		return this.userService.deleteFriend(
			Number(friendData.userId),
			Number(friendData.friendId)
			);
	}

}