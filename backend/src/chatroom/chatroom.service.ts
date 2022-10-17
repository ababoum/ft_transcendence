import { HttpCode, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatRoom, User, UsersMutedinChatRooms, Prisma } from '@prisma/client';
import { CreateChatRoomDto } from './dto/create-chatroom.dto';
import { UpdateChatRoomDto } from './dto/update-chatroom.dto ';
import { networkInterfaces } from 'os';

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
		return this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { participants: { select: { id: true, nickname: true } } },
		})
	}

	async joinChatRoom(userlogin: string, chatroomid: number) {
		const res = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { banList: {where: {login: userlogin}} }
		})
		if (res.banList[0])
			throw new HttpException("You are banned from this chatroom", 403)
		return await this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				participants: { connect: { login: userlogin } },
			},
			select: { participants: { select: { id: true, nickname: true } } },
		});
	}

	async leaveChatRoom(userlogin: string, chatroomid: number) {
		try {	
			let res = await this.prisma.chatRoom.update({
				where: { id: chatroomid },
				data: {
					admin: { disconnect : { login: userlogin } },
					participants: { disconnect : { login: userlogin } },
				},
				select: {ownerlogin: true, participants: {select: {id: true, nickname: true}}}
			});
			if (res.ownerlogin == userlogin) {
				res = await this.prisma.chatRoom.update({
					where: {id:chatroomid},
					data: {
						owner: {connect: {login: "ellacroi"}},
					},
					select: {ownerlogin: true, participants: {select: {id: true, nickname: true}}}
				})
			}
			return res;
		}
		catch {
			throw new HttpException("This room doesn't exist", 404)
		}
	}

// ADMIN //
	async adminsByChatRoom(chatroomid: number) {
		return this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { admin: { select: { id: true, nickname: true } } },
		})
	}

	async adminUser(userlogin: string, chatroomid: number, UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { ownerlogin: true }
		})
		if (res.ownerlogin == userlogin) {
			return await this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				admin: { connect: { login: UpdateChatRoomDto.login } },
				participants: {connect: {login: UpdateChatRoomDto.login}}
			},
			select: {admin: {select: {id: true, nickname: true}}}
			});
		}
		throw new HttpException("You are not the owner of this chatroom", 401)
	}

	async unadminUser(userlogin: string, chatroomid: number, UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { ownerlogin: true }
		})
		if (res.ownerlogin == userlogin) {
			return await this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				admin: { disconnect: { login: UpdateChatRoomDto.login } },
			},
			select: {admin: {select: {id: true, nickname: true}}}
			});
		}
		throw new HttpException("You are not the owner of this chatroom", 401)
	}

// BAN //
	async banListByChatRoom(chatroomid: number) {
		return this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { banList: { select: { id: true, nickname: true } } },
		})
	}

	async banUser(userlogin: string, chatroomid: number, UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { admin: {where: {login: userlogin}} }
		})
		if (res.admin[0]) {
			return await this.prisma.chatRoom.update({
				where: {id: chatroomid},
				data: {
					banList: {connect: {login: UpdateChatRoomDto.login}},
					participants: {disconnect: {login: UpdateChatRoomDto.login}}
				},
				select: {banList: {select: {id: true, nickname: true}}}
			})
		}
		throw new HttpException("You are not admin of this chatroom", 401)
	}

	async unbanUser(userlogin: string, chatroomid: number, UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { admin: {where: {login: userlogin}} }
		})
		if (res.admin[0]) {
			return await this.prisma.chatRoom.update({
				where: {id: chatroomid},
				data: {
					banList: {disconnect: {login: UpdateChatRoomDto.login}}
				},
				select: {banList: {select: {id: true, nickname: true}}}
			})
		}
		throw new HttpException("You are not admin of this chatroom", 401)
	}

// MUTE //
	async muteListByChatRoom(chatroomid: number) {
		return this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { muteList: true},
		})
	}

	async muteUser(userlogin: string, chatroomid: number, UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { admin: {where: {login: userlogin}} }
		})
		if (res.admin[0]) {
			let t = new Date()
			t.setSeconds(t.getSeconds() + UpdateChatRoomDto.duration)
			return await this.prisma.usersMutedinChatRooms.upsert({
				where: {chatRoomId_userLogin: {chatRoomId: chatroomid, userLogin: UpdateChatRoomDto.login}},
				create: {
					chatRoom: {connect: {id: chatroomid}},
					user: {connect: {login: UpdateChatRoomDto.login}},
					mutedUntil:  t.toISOString(),
				},
				update: {
					mutedUntil: t.toISOString(),
				}
			})
		}
		throw new HttpException("You are not admin of this chatroom", 401)
	}

	async unmuteUser(userlogin: string, chatroomid: number, UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { admin: {where: {login: userlogin}} }
		})
		if (res.admin[0]) {
			return await this.prisma.usersMutedinChatRooms.delete({
				where: {chatRoomId_userLogin: {chatRoomId: chatroomid, userLogin: UpdateChatRoomDto.login}}
			})
		}
		throw new HttpException("You are not admin of this chatroom", 401)
	}

}
