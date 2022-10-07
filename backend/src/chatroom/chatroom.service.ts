import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatRoom, Prisma } from '@prisma/client';

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

	async createChatRoom(data): Promise<ChatRoom> {
		return this.prisma.chatRoom.create({data});
	}


/* 	async createChatRoom(data): Promise<ChatRoom> {
		return this.prisma.chatRoom.create({
		  data: {
			name:"Plop",
			owner: {
				connect: {
					email: "aaa"
				}
			}
		  }
		});
	}
 */

}
