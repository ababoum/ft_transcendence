import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatRoom, User, Prisma } from '@prisma/client';

@Injectable()
export class ChatroomService {
	constructor(private prisma: PrismaService) {}

	async chatRoom(
		userWhereUniqueInput: Prisma.UserWhereUniqueInput,
	  ): Promise<ChatRoom | null> {
		return this.prisma.chatRoom.findUnique({
		  where: userWhereUniqueInput,
		});
	  }

	  async chatRooms(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.UserWhereUniqueInput;
		where?: Prisma.UserWhereInput;
		orderBy?: Prisma.UserOrderByWithRelationInput;
	  }): Promise<ChatRoom[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.chatRoom.findMany({
		  skip,
		  take,
		  cursor,
		  where,
		  orderBy,
		});
	  }

	async createChatRoom(data: Prisma.ChatRoomCreateInput): Promise<ChatRoom> {
		return this.prisma.chatRoom.create({data});
	}

// PARTICIPANTS //
	async participantsByChatRoom(chatroomid: number) {
		return this.prisma.user.findMany({
			where: { chatRoomJoined: { some: { id: chatroomid } } },
			select: { id: true, login: true },
		})
	}

	async inviteUser(params: {chatroomid: number; userlogin: string;}): Promise<ChatRoom> {
		const { chatroomid, userlogin } = params;
		return this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				participants: { connect: { login: userlogin } },
			},
		});
	}

	async leaveChatRoom(params: {chatroomid: number; userlogin: string;}): Promise<ChatRoom> {
		const { chatroomid, userlogin } = params;
		// if (this.prisma.chatRoom.ownerlogin = userlogin) {
		// 	return this.prisma.chatRoom.update({
		// 		where: { id: chatroomid },
		// 		data: {
		// 			owner: { connect : { id: 1 } },
		// 			admin: { disconnect : { login: userlogin } },
		// 			participants: { disconnect : { login: userlogin } },
		// 		},
		// 	});
		// }
			return this.prisma.chatRoom.update({
				where: { id: chatroomid },
				data: {
					admin: { disconnect : { login: userlogin } },
					participants: { disconnect : { login: userlogin } },
				},
			});
	}

// ADMIN //
	async adminListByChatRoom(chatroomid: number): Promise<User[]> {
		return this.prisma.user.findMany({
			where: { chatRoomAdmined: { some: { id: chatroomid } } }
		})
	}

	async adminUser(params: {chatroomid: number; userlogin: string;}): Promise<ChatRoom> {
		const { chatroomid, userlogin } = params;
		return this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				admin: { connect: { login: userlogin } },
			},
		});
	}

	async unadminUser(params: {chatroomid: number; userlogin: string;}): Promise<ChatRoom> {
		const { chatroomid, userlogin } = params;
		return this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				admin: { disconnect : { login: userlogin } },
			},
		});
	}

// MUTE //
	async muteListByChatRoom(chatroomid: number): Promise<User[]> {
		return this.prisma.user.findMany({
			where: { chatRoomMuted: { some: { id: chatroomid } } }
		})
	}

	async muteUser(params: {chatroomid: number; userlogin: string;}): Promise<ChatRoom> {
		const { chatroomid, userlogin } = params;
		return this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				muteList: { connect: { login: userlogin } },
			},
		});
	}

	async unmuteUser(params: {chatroomid: number; userlogin: string;}): Promise<ChatRoom> {
		const { chatroomid, userlogin } = params;
		return this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				muteList: { disconnect : { login: userlogin } },
			},
		});
	}

// BAN //
	async banListByChatRoom(chatroomid: number): Promise<User[]> {
		return this.prisma.user.findMany({
			where: { chatRoomBanned: { some: { id: chatroomid } } }
		})
	}

	async banUser(params: {chatroomid: number; userlogin: string;}): Promise<ChatRoom> {
		const { chatroomid, userlogin } = params;
		return this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				banList: { connect: { login: userlogin } },
			},
		});
	}

	async unbanUser(params: {chatroomid: number; userlogin: string;}): Promise<ChatRoom> {
		const { chatroomid, userlogin } = params;
		return this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				banList: { disconnect : { login: userlogin } },
			},
		});
	}

}
