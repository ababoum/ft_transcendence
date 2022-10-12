import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatRoom, User, Prisma } from '@prisma/client';
import { CreateChatRoomDto } from './dto/create-chatroom.dto';
import { UpdateChatRoomDto } from './dto/update-chatroom.dto ';

@Injectable()
export class ChatroomService {
	constructor(private prisma: PrismaService) {}

	async chatRoom(
		userWhereUniqueInput: Prisma.UserWhereUniqueInput,
	  ): Promise<ChatRoom | null> {
		return this.prisma.chatRoom.findUniqueOrThrow({
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

	async createChatRoom(userlogin: string, CreateChatRoomDto: CreateChatRoomDto): Promise<ChatRoom> {
		return this.prisma.chatRoom.create({
			data: {
				name: CreateChatRoomDto.name,
				owner: {connect: {login: userlogin}},
				mode: CreateChatRoomDto.mode,
				admin: {connect: {login: userlogin}},
				participants: {connect: {login: userlogin}},
		}});
	}

// PARTICIPANTS //
	async participantsByChatRoom(chatroomid: number) {
		// try {
		// 	return this.prisma.user.findMany({
		// 		where: { chatRoomJoined: { some: { id: chatroomid } } },
		// 		select: { nickname: true },
		// 	})
		// }
		return this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { participants: { select: { login: true, nickname: true } } },
		})
	}

	async joinChatRoom(userlogin: string, chatroomid: number) {
		try {
			return await this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				participants: { connect: { login: userlogin } },
			},
		});
		}
		catch {
			throw new HttpException("This room doesn't exist", 404)
		}
	}

	async leaveChatRoom(userlogin: string, chatroomid: number) {
		try {	
			return await this.prisma.chatRoom.update({
				where: { id: chatroomid },
				data: {
					admin: { disconnect : { login: userlogin } },
					participants: { disconnect : { login: userlogin } },
				},
			});
		}
		catch {
			throw new HttpException("This room doesn't exist", 404)
		}
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

	async banUser(params: {chatroomid: number; userlogin: string;}) {
		const { chatroomid, userlogin } = params;
		try {
			return await this.prisma.chatRoom.update({
				where: { id: chatroomid },
				data: {
					banList: { connect: { login: userlogin } },
				},
			});
		}
		catch(e) {
			throw new HttpException("User is already banned", 409);
		}
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
