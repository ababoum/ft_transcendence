import { HttpCode, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatRoom, User, UsersMutedinChatRooms, Prisma } from '@prisma/client';
import { CreateChatRoomDto } from './dto/create-chatroom.dto';
import { UpdateChatRoomDto } from './dto/update-chatroom.dto ';
import { MessageDto } from './dto/message.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatroomService {
	constructor(private prisma: PrismaService) {}

	async chatRoom(
		userWhereUniqueInput: Prisma.UserWhereUniqueInput,
	  ): Promise<ChatRoom | null> {
		return await this.prisma.chatRoom.findUniqueOrThrow({
		  where: userWhereUniqueInput,
		});
	  }

	  async chatRooms(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.UserWhereUniqueInput;
		where?: Prisma.UserWhereInput;
	  }){
		const { skip, take, cursor, where } = params;
		return await this.prisma.chatRoom.findMany({
		  skip,
		  take,
		  cursor,
		  where,
		  orderBy: {id: "asc"},
		  select: {
			id: true,
			name: true,
			creationDate: true,
			mode: true,
			ownerNickname: true,
			password: false,
			admin: {select: {id: true, nickname: true}},
			participants: {select: {id: true, nickname: true}},
			banList: {select: {id: true, nickname: true}},
			muteList: {select: {user: {select: {id: true, nickname: true}}, mutedUntil: true}},
		}
		});
	  }

	async createChatRoom(userlogin: string, CreateChatRoomDto: CreateChatRoomDto): Promise<ChatRoom> {
		let hash = null
		if (CreateChatRoomDto.mode == "PROTECTED") {
			const salt = await bcrypt.genSalt();
			hash = await bcrypt.hash(CreateChatRoomDto.password, salt);
		}
		const res = await this.prisma.chatRoom.create({
			data: {
				name: CreateChatRoomDto.name,
				owner: {connect: {login: userlogin}},
				mode: CreateChatRoomDto.mode,
				admin: {connect: {login: userlogin}},
				participants: {connect: {login: userlogin}},
				password: hash
			},
			include :{
				admin: {select: {id: true, nickname: true}},
				participants: {select: {id: true, nickname: true}},
		 		banList: {select: {id: true, nickname: true}},
		 		muteList: {select: {user: {select: {id: true, nickname: true}}, mutedUntil: true}}
			}
		});
		return res;
	}

	async addPassword(userlogin: string, chatroomid: number, UpdateChatRoomDto: UpdateChatRoomDto) {
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(UpdateChatRoomDto.password, salt);
		const res = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { owner: true }
		})
		if (res.owner.login == userlogin) {
			return await this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				mode: "PROTECTED",
				password: hash
			},
			select: {
				mode: true
			}
			});
		}
		throw new HttpException("You are not the owner of this chatroom", 401)
	}

	async changePassword(userlogin: string, chatroomid: number, UpdateChatRoomDto: UpdateChatRoomDto) {
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(UpdateChatRoomDto.password, salt);
		const res = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { owner: true }
		})
		if (res.owner.login == userlogin) {
			return await this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				password: hash
			},
			select: {
				mode: true
			}
			});
		}
		throw new HttpException("You are not the owner of this chatroom", 401)
	}

	async removePassword(userlogin: string, chatroomid: number) {
		const res = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { owner: true }
		})
		if (res.owner.login == userlogin) {
			return await this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				mode: "PUBLIC",
				password: null
			},
			select: {
				mode: true
			}
			});
		}
		throw new HttpException("You are not the owner of this chatroom", 401)
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
			throw new HttpException("You are banned from this chatroom", 401)
		return await this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				participants: { connect: { login: userlogin } },
			},
			select: { participants: { select: { id: true, nickname: true } } },
		});
	}

	async joinProtectedChatRoom(userlogin: string, chatroomid: number, password: string) {
		const res = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { 
				banList: {where: {login: userlogin}},
				password: true
			}
		})
		if (res.banList[0])
			throw new HttpException("You are banned from this chatroom", 401)
		if(await bcrypt.compare(password, res.password) == false)
			throw new HttpException("Wrong password", 401)
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
				select: {
					owner: true, 
					participants: {select: {id: true, nickname: true}},
					admin: {select: {id: true, nickname: true}},
				}
			});
			if (res.owner.login == userlogin) {
				res = await this.prisma.chatRoom.update({
					where: {id:chatroomid},
					data: {
						owner: {connect: {id: 1}},
						admin: {connect: {id: 1}},
					},
					select: {
						owner: true, 
						participants: {select: {id: true, nickname: true}},
						admin: {select: {id: true, nickname: true}},
					}
				})
			}
			return res;
		}
		catch {
			throw new HttpException("This room doesn't exist", 404)
		}
	}

	async inviteUser(userlogin: string, chatroomid: number, nickname: string) {
		const res = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { 
				participants: {where: {login: userlogin}},
				banList: {where: {nickname: nickname}}
		}
		})
		if (res.participants[0]) {
			if (res.banList[0])
				throw new HttpException("This user is banned from this chatroom", 401)
			return await this.prisma.chatRoom.update({
				where: { id: chatroomid },
				data: {
					participants: { connect: { nickname: nickname } },
				},
				select: { participants: { select: { id: true, nickname: true } } },
			});
		}
		throw new HttpException("You are not participant of this chatroom", 401)
	}

// ADMIN //
	async adminsByChatRoom(chatroomid: number) {
		return await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { admin: { select: { id: true, nickname: true } } },
		})
	}

	async adminUser(userlogin: string, chatroomid: number, UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { owner: true }
		})
		if (res.owner.login == userlogin) {
			return await this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				admin: { connect: { nickname: UpdateChatRoomDto.nickname } },
				participants: {connect: {nickname: UpdateChatRoomDto.nickname}}
			},
			select: {
				admin: {select: {id: true, nickname: true}},
				participants: {select: {id: true, nickname: true}}
			}
			});
		}
		throw new HttpException("You are not the owner of this chatroom", 401)
	}

	async unadminUser(userlogin: string, chatroomid: number, UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { owner: true }
		})
		if (res.owner.login == userlogin) {
			return await this.prisma.chatRoom.update({
			where: { id: chatroomid },
			data: {
				admin: { disconnect: { nickname: UpdateChatRoomDto.nickname } },
			},
			select: {admin: {select: {id: true, nickname: true}}}
			});
		}
		throw new HttpException("You are not the owner of this chatroom", 401)
	}

// BAN //
	async banListByChatRoom(chatroomid: number) {
		return await this.prisma.chatRoom.findUniqueOrThrow({
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
					banList: {connect: {nickname: UpdateChatRoomDto.nickname}},
					participants: {disconnect: {nickname: UpdateChatRoomDto.nickname}}
				},
				select: {
					banList: {select: {id: true, nickname: true}},
					participants: {select: {id: true, nickname: true}}
				}
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
					banList: {disconnect: {nickname: UpdateChatRoomDto.nickname}}
				},
				select: {banList: {select: {id: true, nickname: true}}}
			})
		}
		throw new HttpException("You are not admin of this chatroom", 401)
	}

// MUTE //
	async muteListByChatRoom(chatroomid: number) {
		return await this.prisma.chatRoom.findUniqueOrThrow({
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
				where: {chatRoomId_nickname: {chatRoomId: chatroomid, nickname: UpdateChatRoomDto.nickname}},
				create: {
					chatRoom: {connect: {id: chatroomid}},
					user: {connect: {nickname: UpdateChatRoomDto.nickname}},
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
				where: {chatRoomId_nickname: {chatRoomId: chatroomid, nickname: UpdateChatRoomDto.nickname}}
			})
		}
		throw new HttpException("You are not admin of this chatroom", 401)
	}

	async getMessages(chatroomid: number) {
		const res =  await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { messages: { select: { author: {select: {id: true, nickname: true}}, creationDate: true, content: true } } },
		})
		return res.messages
	}

	async postMessage(userlogin: string, chatroomid: number, MessageDto: MessageDto) {
		const res = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: chatroomid },
			select: { 
				participants: {where: {login: userlogin}},
				muteList: {where: {user: {login: userlogin}}}
			}
		})
		if (res.muteList[0] && new Date(res.muteList[0].mutedUntil) > new Date())
			throw new HttpException("You are currently muted in this chatroom", 401)
		if (res.participants[0]) {
			return await this.prisma.messages.create({
				data: {
					authorLogin: userlogin,
					content: MessageDto.content,
					chatRoomId: chatroomid
				},
				select: { author: {select: {id: true, nickname: true}}, creationDate: true, content: true },
			})
		}
		throw new HttpException("You are not participant of this chatroom", 401)
	}
}
