import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Delete,
	UseGuards,
	Request,
	UseInterceptors,
	UploadedFile,
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
	Header,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
	User as UserModel,
	Friend as FriendModel,
	Image as ImageModel
} from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as shortid from 'shortid';
import * as mime from 'mime-types';


@Controller('users')
export class UserController {

	constructor(private readonly userService: UserService) { }


	/////////////////////// ACCESS USER INFO ////////////////////////

	@Get('id/:id')
	async getUserById(@Param('id') id: string): Promise<UserModel> {
		return this.userService.user({ id: Number(id) });
	}

	@Get('profile/:login')
	async getUserByLogin(@Param('login') login: string): Promise<UserModel> {
		return this.userService.user({ login: login });
	}

	@Get()
	async findUsersById(): Promise<UserModel[]> {
		return this.userService.users({});
	}

	/////////////////////// CREATE/DELETE USERS ////////////////////////

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


	/////////////////////// MANAGE USER'S FRIENDSHIP ////////////////////////

	@Post('add_friend')
	async addFriend(
		@Body() friendData: { userId: string; friendId: string })
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

	@Get('/:userId/friends')
	async getFriendsList(@Param('userId') userId: string)
		: Promise<UserModel[]> {
		return this.userService.friends(Number(userId));
	}

	@Delete('/friends')
	async deleteFriend(
		@Body() friendData: { userId: string; friendId: string }) {
		return this.userService.deleteFriend(
			Number(friendData.userId),
			Number(friendData.friendId)
		);
	}

	/////////////////////// MANAGE USER'S AVATAR ////////////////////////


	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor(
		'file',
		{
			storage: diskStorage({
				destination: './uploads/',
				filename: function (req, file, cb) {
					/* generates a "unique" name - not collision proof but unique enough for small sized applications */
					let id = shortid.generate();
					/* need to use the file's mimetype because the file name may not have an extension at all */
					let ext = mime.extension(file.mimetype);
					cb(null, `${id}.${ext}`);
				}
			}),
		})
	)
	@Post('upload_avatar')
	async addAvatar(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 2000000 }),
					new FileTypeValidator({ fileType: 'jpeg|png' }),
				],
			}),
		)
		file: Express.Multer.File,
		@Request() req,
		@Body() body) {

		const img = await this.userService.createImage(file);
		return this.userService.linkAvatar(img, req.user.login);
	}

	@Get('image/:id')
	async getImageById(@Param('id') id: string): Promise<ImageModel> {
		return this.userService.image({ id: Number(id) });
	}
}