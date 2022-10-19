import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Friend, Prisma, Image } from '@prisma/client';
import { capitalizeFirstLetter } from '../utils';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) { }


	/////////////////////// ACCESS USER INFO ////////////////////////


	async user(
		userWhereUniqueInput: Prisma.UserWhereUniqueInput,
	): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: userWhereUniqueInput,
		});
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
			console.log(e)
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
		return this.prisma.user.update({
			data,
			where,
		});
	}

	async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {

		const result = await this.prisma.user.delete({
			where,
		});
		return result;
	}


	/////////////////////// MANAGE USER'S FRIENDSHIP ////////////////////////


	async addFriend(userId: number, friendId: number): Promise<Friend> {

		// create the friendship
		const new_friendship = await this.prisma.friend.create({
			data: {
				userId: userId,
				friendUserId: friendId
			}
		});

		await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				userFriends: {
					connect: {
						id: new_friendship.id
					},
				},
			}
		});

		return new_friendship;
	}

	async friends(userId: number): Promise<User[]> {

		// retrieve the list of friendships
		const friends_list = await this.prisma.friend.findMany({
			where: {
				userId: userId
			},
			select: {
				friendUserId: true
			}
		}
		);

		// retrieve the list of users listed in the friendships
		const result = await this.prisma.user.findMany({
			where: {
				id: {
					in: friends_list.map(object => object.friendUserId)
				}
			}
		});

		return result;
	}

	async deleteFriend(userId: number, friendId: number) {

		const result = await this.prisma.friend.deleteMany({
			where: {
				OR: [
					{
						AND: [
							{ userId: userId },
							{ friendUserId: friendId }
						]
					},
					{
						AND: [
							{ userId: friendId },
							{ friendUserId: userId }
						]
					}
				]
			}
		})
		return result;
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