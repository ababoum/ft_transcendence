import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Delete,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatRoom as ChatRoomModel } from '@prisma/client';
import { User } from '@prisma/client';

@Controller('chatroom')
export class ChatroomController {

	constructor(private readonly ChatroomService: ChatroomService) { }

	@Get()
	findAllChatRooms() {
		return this.ChatroomService.chatRooms({});
	}

 	@Post('create')
	async createChatRoom(
		@Body() ChatRoomData: { name: string, owneremail: string },
	): Promise<ChatRoomModel> {
		const { name, owneremail } = ChatRoomData;
		return this.ChatroomService.createChatRoom({
			name,
			owner: {
				connect: { email: owneremail }
			}
		});
	}

/* 	@Post('create')
	async createChatRoom(
		@Body() ChatRoomData: { name: string; owneremail: string},
	): Promise<ChatRoomModel> {
		const { name, owneremail,  } = ChatRoomData;
		return this.ChatroomService.createChatRoom({
			name,
			owner: {
				connect: { email: owneremail},
			},
			participants: undefined,
			banList: undefined,
			muteList: undefined
		});
	} */

}
