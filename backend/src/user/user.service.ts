import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Friend, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) { }

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

	async createUser(data: Prisma.UserCreateInput): Promise<User> {
		return this.prisma.user.create({
			data,
		});
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
			const result = this.prisma.user.delete({
				where,
			});
			return result;
	}

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
							{userId: userId},
							{friendUserId: friendId}
						]
					},
					{
						AND: [
							{userId: friendId},
							{friendUserId: userId}
						]
					}
				]
			}
		})
		return result;
	}
}