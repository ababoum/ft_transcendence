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

	// FOR INTERNAL USE ONLY
	async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput)
		: Promise<User | null> {

		const usr = await this.prisma.user.findUnique({
			where: userWhereUniqueInput,
		});
		if (!usr)
			throw new HttpException("User not found", 404);
		return usr;
	}

	async getUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
		const user = await this.prisma.user.findUnique({
			where: userWhereUniqueInput,
			select: {
				id: true,
				email: true,
				login: true,
				nickname: true,
				status: true,
				imageId: true,
				isTwoFAEnabled: true,
				profile_picture: true,
				random_password: true,
				rating: true,
				first_login: true
			}
		});
		if (!user)
			throw new HttpException("User not found", 404);
		return user;
	}

	async userFindOrCreate(login: string, email: string, FT_id: number, avatar_url: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				login: login
			},
		});

		// if user not found, create it with 42 info
		if (!user) {
			const new_user = await this.prisma.user.create({
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

			return new_user;
		}
		else {
			return user;
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

	async getUserPublicDatabyNickname(nickname: string) {

		const user = await this.prisma.user.findUnique({
			where: {
				nickname: nickname
			},
			select: {
				login: true,
				rating: true,
				email: true,
				nickname: true,
				status: true
			}
		});

		if (!user)
			throw new HttpException("User not found", 404);

		return user;
	}


	/////////////////////// CREATE/DELETE USERS ////////////////////////


	async createUser(data: Prisma.UserCreateInput) {
		try {
			await this.prisma.user.create({
				data,
			});

			const light_new_user = await this.prisma.user.findUnique({
				where: {
					login: data.login
				},
				select: {
					id: true,
					email: true,
					login: true,
					nickname: true,
					status: true,
					imageId: true,
					isTwoFAEnabled: true,
					profile_picture: true,
					random_password: true,
					rating: true,
				first_login: true
				}
			});

			return light_new_user;
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
	}) {
		const { where, data } = params;

		try {
			const updated_user = await this.prisma.user.update({
				data,
				where
			});

			const light_updated_user = await this.prisma.user.findUnique({
				where: params.where,
				select: {
					id: true,
					email: true,
					login: true,
					nickname: true,
					status: true,
					imageId: true,
					isTwoFAEnabled: true,
					profile_picture: true,
					random_password: true,
					rating: true,
					first_login: true
				}
			});

			return light_updated_user;
		}
		catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					throw new HttpException(
						`This ${(e.meta.target as string)} already exists`,
						400);
				}
			}
		}
	}


	///////////////////////    UPDATE USER STATUS    ////////////////////////

	async updateStatus
		(userLogin: string, status: 'online' | 'offline' | 'in-game') {

		let res: User;

		switch (status) {
			case 'online':
				res = await this.prisma.user.update({
					where: {
						login: userLogin
					},
					data: {
						status: 'ONLINE'
					}
				});
				break;

			case 'offline':
				res = await this.prisma.user.update({
					where: {
						login: userLogin
					},
					data: {
						status: 'OFFLINE'
					}
				});
				break;
			case 'in-game':

				res = await this.prisma.user.update({
					where: {
						login: userLogin
					},
					data: {
						status: 'INGAME'
					}
				});
				break;

			default:
				throw new HttpException("Invalid status", 400);
		}

		return res;
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
		else if (friend.login === me.login)
			throw new HttpException("You cannot add yourself as friend", 409);

		try {
			const new_friendship = await this.prisma.friendship.create({
				data: {
					friendId: me.id,
					friendWithId: friend.id,
				}
			});
			return new_friendship;
		}
		catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					throw new HttpException(
						`${friend.nickname} is already your friend`, 409);
				}
			}
		}

	}

	async friendsbyLogin(login: string) {

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
			},
			select: {
				id: true,
				email: true,
				login: true,
				nickname: true,
				status: true,
				imageId: true,
				isTwoFAEnabled: true,
				profile_picture: true,
				random_password: true,
				rating: true
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

		const del = await this.prisma.friendship.deleteMany({
			where: {
				friendId: me.id,
				friendWithId: friend.id
			}
		})

		return del;
	}


	/////////////////////// MANAGE USER'S AVATAR ////////////////////////

	async createImage(imageData: Express.Multer.File): Promise<Image> {
		return await this.prisma.image.create({
			data: {
				filename: imageData.filename,
				filepath: imageData.path,
				mimetype: imageData.mimetype,
				size: imageData.size,
			},
		});
	}

	async linkAvatar(image: Image, login: string): Promise<User> {
		return await this.prisma.user.update({
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
			throw new HttpException("Requested image not found", 210);

		const img = await this.prisma.image.findUnique({
			where: imageWhereUniqueInput,
		});

		if (!img)
			throw new HttpException("Requested image not found", 210);
		return img;
	}

	/////////////////////// MANAGE USER'S 2FA ////////////////////////

	async turnOnTwoFactorAuthentication(login: string) {
		return await this.prisma.user.update({
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
		return await this.prisma.user.update({
			where: {
				login: login
			},
			data: {
				TwoFA_secret: secret
			}
		});
	}

	/////////////////////// MANAGE USER'S BLOCKLIST ////////////////////////

	async getMyBlockList(userLogin: string) {
		const res = await this.prisma.user.findUnique({
			where: { login: userLogin },
			select: { blockedList: { select: { nickname: true } } }
		})

		return res.blockedList;
	}

	async blockUser(userLogin: string, blockedNickname: string) {
		const user = await this.prisma.user.findUniqueOrThrow({
			where: { login: userLogin },
			select: { nickname: true }
		})
		if (user.nickname !== blockedNickname) {
			try {
				const res = await this.prisma.user.update({
					where: { login: userLogin },
					data: {
						blockedList: { connect: { nickname: blockedNickname } }
					},
					select: { blockedList: { select: { nickname: true } } }
				})
				return res.blockedList;
			}
			catch {
				throw new HttpException("User not found", 404);
			}
		}
		throw new HttpException("You can't block yourself", 409);
	}

	async unblockUser(userLogin: string, blockedNickname: string) {
		const relation = await this.prisma.user.findUniqueOrThrow({
			where: { login: userLogin },
			select: { blockedList: { where: { nickname: blockedNickname } } }
		})
		console.log(relation)
		if (relation.blockedList[0]) {
			const res = await this.prisma.user.update({
				where: { login: userLogin },
				data: {
					blockedList: { disconnect: { nickname: blockedNickname } }
				},
				select: { blockedList: { select: { nickname: true } } }
			})

			return res.blockedList;
		}
		throw new HttpException("User not found in your blocklist", 404);
	}



}