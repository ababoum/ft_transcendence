import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma, Image } from '@prisma/client';
import { capitalizeFirstLetter } from '../utils';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) { }


	/////////////////////// ACCESS USER INFO ////////////////////////

	// For 42 users
	private generate_random_password(): string {
		const password =
			Math.random().toString(36).slice(2, 15) +
			Math.random().toString(36).slice(2, 15);
		return password;
	}

	async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput)
		: Promise<User | null> {

		const usr = await this.prisma.user.findUnique({
			where: userWhereUniqueInput,
		});
		if (!usr)
			throw new HttpException("User not found", 404);
		return usr;
	}

	async userFindOrCreate(login: string, email: string, FT_id: number, avatar_url: string) {
		const usr = await this.prisma.user.findUnique({
			where: {
				login: login
			},
		});

		// if user not found, create it with 42 info
		if (!usr) {
			const new_usr = await this.prisma.user.create({
				data: {
					email: email,
					login: login,
					nickname: login,
					password: this.generate_random_password(),
					FT_id: FT_id,
					profile_picture: avatar_url,
					random_password: true
				}
			});

			return new_usr;
		}
		else {
			return usr;
		}
	}

	async users(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.UserWhereUniqueInput;
		where?: Prisma.UserWhereInput;
		orderBy?: Prisma.UserOrderByWithRelationInput;
	}): Promise<User[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.user.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}


	/////////////////////// CREATE/DELETE USERS ////////////////////////


	async createUser(data: Prisma.UserCreateInput): Promise<User> {
		try {
			return await this.prisma.user.create({
				data,
			});
		}
		catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					throw new HttpException(
						`${capitalizeFirstLetter(e.meta.target as string)} already exists`,
						400);
				}
			}
		}
	}

	async updateUser(params: {
		where: Prisma.UserWhereUniqueInput;
		data: Prisma.UserUpdateInput;
	}): Promise<User> {
		const { where, data } = params;

		try {

			return this.prisma.user.update({
				data,
				where,
			});
		}
		catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					throw new HttpException(
						`${capitalizeFirstLetter(e.meta.target as string)} already exists`,
						400);
				}
			}
		}
	}

	async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {

		const result = await this.prisma.user.delete({
			where,
		});
		return result;
	}


	/////////////////////// MANAGE USER'S FRIENDSHIP ////////////////////////


	async addFriend(userLogin: string, friendNickname: string) {

		const me = await this.prisma.user.findUnique({
			where: { login: userLogin }
		});

		const friend = await this.prisma.user.findUnique({
			where: { nickname: friendNickname }
		});

		if (!friend)
			throw new HttpException("User not found", 404);

		const new_friendship = await this.prisma.friendship.create({
			data: {
				friendId: me.id,
				friendWithId: friend.id,
			}
		});

		return new_friendship;
	}

	async friendsbyLogin(login: string): Promise<User[]> {

		const me = await this.prisma.user.findUnique({
			where: { login: login }
		});

		const friendList = await this.prisma.friendship.findMany({
			where: {
				friendId: me.id
			}
		});

		let friendsListId = [];
		friendList.forEach(data => friendsListId.push(data.friendWithId));

		const list = await this.prisma.user.findMany({
			where: {
				id: {
					in: friendsListId
				}
			}
		});

		return list;
	}

	async deleteFriend(login: string, friendNickname: string) {

		const friend = await this.prisma.user.findUnique({
			where: { nickname: friendNickname }
		});

		const me = await this.prisma.user.findUnique({
			where: { login: login }
		});

		if (!friend)
			throw new HttpException("User not found", 404);

		const del = await  this.prisma.friendship.deleteMany({
			where: {
				friendId: me.id,
				friendWithId: friend.id
			}
		})

		return del;
	}


	/////////////////////// MANAGE USER'S AVATAR ////////////////////////

	async createImage(imageData: Express.Multer.File): Promise<Image> {
		return this.prisma.image.create({
			data: {
				filename: imageData.filename,
				filepath: imageData.path,
				mimetype: imageData.mimetype,
				size: imageData.size,
			},
		});
	}

	async linkAvatar(image: Image, login: string): Promise<User> {
		return this.prisma.user.update({
			where: {
				login: login
			},
			data: {
				avatar: {
					connect: {
						id: image.id
					}
				}
			}
		})
	}

	async image(
		imageWhereUniqueInput: Prisma.ImageWhereUniqueInput,
	): Promise<Image | null> {

		if (imageWhereUniqueInput.id === null)
			throw new HttpException("Requested image not found", 404);

		const img = await this.prisma.image.findUnique({
			where: imageWhereUniqueInput,
		});

		if (!img)
			throw new HttpException("Requested image not found", 404);
		return img;
	}

	/////////////////////// MANAGE USER'S 2FA ////////////////////////

	async turnOnTwoFactorAuthentication(login: string) {
		return this.prisma.user.update({
			where: {
				login: login
			},
			data: {
				isTwoFAEnabled: true
			}
		});
	}

	async setTwoFactorAuthenticationSecret(secret: string, login: string)
		: Promise<User> {
		return this.prisma.user.update({
			where: {
				login: login
			},
			data: {
				TwoFA_secret: secret
			}
		});
	}



}