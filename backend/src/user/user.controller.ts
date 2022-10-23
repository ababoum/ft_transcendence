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
	Res,
	StreamableFile,
	Patch,
	HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
	User as UserModel,
	Friend as FriendModel,
	Image as ImageModel
} from '@prisma/client';
import { JwtAuthGuard, LocalAuthGuard } from '../auth/auth.guards';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as shortid from 'shortid';
import * as mime from 'mime-types';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateEmailDto, UpdateNicknameDto, UpdatePasswordDto } from './user.dto';
import { RequestWithUser } from '../auth/auth.interfaces';
import { createReadStream } from 'fs';
import type { Response } from 'express';
import { AuthService } from '../auth/auth.service';

@Controller('users')
@ApiTags('users')
export class UserController {

	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService) { }


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
	@ApiBody({ type: CreateUserDto })
	async signupUser(
		@Body() userData: CreateUserDto)
		: Promise<UserModel> {
		return this.userService.createUser(userData);
	}

	@Delete('id/:id')
	async deleteUserById(@Param('id') id: string): Promise<UserModel> {
		return this.userService.deleteUser({ id: Number(id) });
	}

	@Delete('login/:login')
	async deleteUserByLogin(@Param('login') login: string): Promise<UserModel> {
		return this.userService.deleteUser({ login: login });
	}

	///////////////////////   UPDATE USER    ///////////////////////

	@UseGuards(JwtAuthGuard)
	@Patch('update/email')
	async updateUserEmail(
		@Request() req,
		@Body() body: UpdateEmailDto) {
		const update = this.userService.updateUser(
			{
				where: { login: req.user.login },
				data: { email: body.new_email }
			}
		)
	}

	@UseGuards(JwtAuthGuard)
	@Patch('update/nickname')
	async updateUserNickname(
		@Request() req,
		@Body() body: UpdateNicknameDto) {
		const update = this.userService.updateUser(
			{
				where: { login: req.user.login },
				data: { nickname: body.new_nickname }
			}
		)
	}

	@UseGuards(JwtAuthGuard)
	@Patch('update/password')
	async updateUserPassword(
		@Request() req,
		@Body() body: UpdatePasswordDto) {

		const user = await this.authService.validateUser(req.user.login, body.old_password);
		if (!user) {
			throw new HttpException("Old password is incorrect. Try again!", 401);
		}
	
		const update = await this.userService.updateUser(
			{
				where: { login: req.user.login },
				data: { password: body.new_password }
			}
		)
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
		@Request() req: RequestWithUser) {

		const img = await this.userService.createImage(file);
		return this.userService.linkAvatar(img, req.user.login);
	}

	// Get image by imageId
	@Get('image/:id')
	async getImageById(
		@Param('id') id: string,
		@Res({ passthrough: true }) res: Response)
		: Promise<StreamableFile> {

		let id_number: number = parseInt(id);
		if (isNaN(id_number)) { id_number = 0 };

		const img_object: ImageModel = await this.userService.image({ id: id_number });

		const file = createReadStream(img_object.filepath);
		res.set({
			'Content-Type': `${img_object.mimetype}`,
			'Content-Disposition': `attachment; filename="${img_object.filename}"`,
		});
		return new StreamableFile(file);
	}

	// Get avatar by userLogin
	@Get('avatar/:login')
	async getAvatarByLogin(
		@Param('login') login: string,
		@Res({ passthrough: true }) res: Response)
		: Promise<StreamableFile> {

		const img_object: ImageModel = await this.userService.image({
			id: await this.userService.user({ login: login }).then(usr => usr.imageId)
		});

		const file = createReadStream(img_object.filepath);
		res.set({
			'Content-Type': `${img_object.mimetype}`,
			'Content-Disposition': `attachment; filename="${img_object.filename}"`,
		});
		return new StreamableFile(file);
	}
}