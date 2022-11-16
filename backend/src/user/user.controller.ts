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
	Req,
	HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
	User as UserModel,
	Image as ImageModel
} from '@prisma/client';
import { JwtAuthGuard, LocalAuthGuard } from '../auth/auth.guards';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as shortid from 'shortid';
import * as mime from 'mime-types';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, NicknameDTO, UpdateEmailDto, UpdateNicknameDto, UpdatePasswordDto } from './user.dto';
import { RequestWithUser } from '../auth/auth.interfaces';
import { createReadStream } from 'fs';
import type { Response } from 'express';
import { AuthService } from '../auth/auth.service';


@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UserController {

	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService) { }


	/////////////////////// ACCESS USER INFO ////////////////////////

	@Get('id/:id')
	async getUserById(@Param('id') id: string) {
		const user = await this.userService.getUser({
			id: Number(id)
		});

		if (!user)
			throw new HttpException("User not found", HttpStatus.NOT_FOUND);
		return user;
	}

	@Get('profile/:nickname')
	async getUserByLogin(@Param('nickname') nickname: string) {
		const user = await this.userService.getUser({
			nickname: nickname
		});

		if (!user)
			throw new HttpException("User not found", HttpStatus.NOT_FOUND);
		return user;
	}

	// @Get()
	// async findUsersById(): Promise<UserModel[]> {
	// 	return await this.userService.users({});
	// }

	// public data of a user
	@Get('public/:nickname')
	@UseGuards(JwtAuthGuard)
	async getUserPublicDataByNickname(@Param('nickname') nickname: string) {
		return await this.userService.getUserPublicDatabyNickname(nickname);
	}


	/////////////////////// CREATE/DELETE USERS ////////////////////////

	@Post('create')
	@ApiBody({ type: CreateUserDto })
	async signupUser(
		@Body() userData: CreateUserDto) {

		const new_user = await this.userService.createUser(userData);
		return new_user;
	}

	// @Delete('id/:id')
	// async deleteUserById(@Param('id') id: string): Promise<UserModel> {
	// 	return this.userService.deleteUser({ id: Number(id) });
	// }

	// @Delete('login/:login')
	// async deleteUserByLogin(@Param('login') login: string): Promise<UserModel> {
	// 	return this.userService.deleteUser({ login: login });
	// }

	///////////////////////   UPDATE USER INFO    ///////////////////////

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

		return update;
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
		);

		return update;
	}

	@UseGuards(JwtAuthGuard)
	@Patch('update/password')
	async updateUserPassword(
		@Request() req,
		@Body() body: UpdatePasswordDto) {

		const usr = await this.userService.getUser({ login: req.user.login });
		// check old password only if it was not random (42-logged in user)
		if (!usr.random_password) {
			const valid_user = await this.authService.validateUser(req.user.login, body.old_password);
			if (!valid_user) {
				throw new HttpException("Old password is incorrect. Try again!", 401);
			}
		}

		const update = await this.userService.updateUser(
			{
				where: { login: req.user.login },
				data: {
					password: body.new_password,
					random_password: false
				}
			}
		);

		return update;
	}

	/////////////////////// UPDATE USER STATUS ////////////////////////

	@Patch('status/:value')
	@UseGuards(JwtAuthGuard)
	async updateUserStatus(
		@Req() req: RequestWithUser,
		@Param('value') status: 'online' | 'offline' | 'in-game') {
		return await this.userService.updateStatus(req.user.login, status);
	}

	/////////////////////// MANAGE USER'S FRIENDSHIPS ////////////////////////


	@Post('add_friend')
	@UseGuards(JwtAuthGuard)
	async addFriendbyNickname(
		@Req() req: RequestWithUser,
		@Body() body: NicknameDTO) {
		return await this.userService.addFriend(req.user.login, body.nickname);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/myfriends')
	async getMyFriendsList(@Req() req) {
		return await this.userService.friendsbyLogin(req.user.login);
	}

	@Delete('/friend')
	@UseGuards(JwtAuthGuard)
	async deleteFriend(
		@Req() req: RequestWithUser,
		@Body() body: NicknameDTO) {

		return await this.userService.deleteFriend(req.user.login, body.nickname);
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
		await this.userService.linkAvatar(img, req.user.login);

		return img.id;
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
	@Get('avatar/:nickname')
	async getAvatarBynickname(
		@Param('nickname') nickname: string,
		@Res({ passthrough: true }) res: Response)
		: Promise<StreamableFile> {

		const img_object: ImageModel = await this.userService.image({
			id: await this.userService.getUser({ nickname: nickname }).then(usr => usr.imageId)
		});

		const file = createReadStream(img_object.filepath);
		res.set({
			'Content-Type': `${img_object.mimetype}`,
			'Content-Disposition': `attachment; filename="${img_object.filename}"`,
		});
		return new StreamableFile(file);
	}

	// Get avatar from 42 by userNickname
	@Get('ft_avatar/:nickname')
	async getFTAvatarByNickname(
		@Param('nickname') nickname: string)
		: Promise<string> {

		return await this.userService.getUser({ nickname: nickname })
			.then(user => user.profile_picture);
	}

	/////////////////////// MANAGE USER'S BLOCKLIST ////////////////////////

	@Post('blockUser')
	@UseGuards(JwtAuthGuard)
	async blockUserbyNickname(
		@Req() req: RequestWithUser,
		@Body() body: NicknameDTO) {
		return await this.userService.blockUser(req.user.login, body.nickname);
	}

	@UseGuards(JwtAuthGuard)
	@Get('blockList')
	async getMyBlockList(@Req() req) {
		return await this.userService.getMyBlockList(req.user.login);
	}

	@Delete('unblockUser')
	@UseGuards(JwtAuthGuard)
	async deleteBlocked(
		@Req() req: RequestWithUser,
		@Body() body: NicknameDTO) {

		return await this.userService.unblockUser(req.user.login, body.nickname);
	}
}