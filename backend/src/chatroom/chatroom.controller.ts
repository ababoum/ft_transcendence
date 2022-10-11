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
import { User as UserModel } from '@prisma/client';
import { chatRoomType } from '@prisma/client';


@Controller('chatroom')
export class ChatroomController {

	constructor(private readonly ChatroomService: ChatroomService) { }

	@Get()
	findAllChatRooms() {
		return this.ChatroomService.chatRooms({});
	}

 	@Post('create')
	async createChatRoom(
		@Body() ChatRoomData: { name: string, ownerlogin: string, mode?: chatRoomType},
	): Promise<ChatRoomModel> {
		const { name, ownerlogin, mode } = ChatRoomData;
		return this.ChatroomService.createChatRoom({
			name,
			owner: {
				connect: { login: ownerlogin }
			},
			mode,
			participants: {
				connect: {login: ownerlogin }
			},
			admin: {
				connect: {login: ownerlogin }
			}
		});
	}

// PARTICIPANTS //
	@Get('participants')
	async participants(@Body() ChatRoomData: { chatroomid: number } ) {
		const {chatroomid} = ChatRoomData;
		return this.ChatroomService.participantsByChatRoom(chatroomid);
	}

	@Post('invite')
	async invite(
		@Body() ChatRoomData: { chatroomid: number, userlogin: string },
	) {
		const { chatroomid, userlogin } = ChatRoomData;
		return this.ChatroomService.inviteUser({
			chatroomid,
			userlogin
		});
	}

	@Post('leave')
	async leave(
		@Body() ChatRoomData: { chatroomid: number, userlogin: string },
	): Promise<ChatRoomModel> {
		const { chatroomid, userlogin } = ChatRoomData;
		return this.ChatroomService.leaveChatRoom({
			chatroomid,
			userlogin
		});
	}

	// MUTE //
		@Get('adminList')
		async adminList(@Body() ChatRoomData: { chatroomid: number } ) {
			const {chatroomid} = ChatRoomData;
			return this.ChatroomService.adminListByChatRoom(chatroomid);
		}

		@Post('admin')
		async adminUser(
			@Body() ChatRoomData: { chatroomid: number, userlogin: string },
		) {
			const { chatroomid, userlogin } = ChatRoomData;
			return this.ChatroomService.adminUser({
				chatroomid,
				userlogin
			});
		}

		@Post('unadmin')
		async unadminUser(
			@Body() ChatRoomData: { chatroomid: number, userlogin: string },
		): Promise<ChatRoomModel> {
			const { chatroomid, userlogin } = ChatRoomData;
			return this.ChatroomService.unadminUser({
				chatroomid,
				userlogin
			});
		}

// MUTE //
	@Get('muteList')
	async muteList(@Body() ChatRoomData: { chatroomid: number } ) {
		const {chatroomid} = ChatRoomData;
		return this.ChatroomService.muteListByChatRoom(chatroomid);
	}

	@Post('mute')
	async muteUser(
		@Body() ChatRoomData: { chatroomid: number, userlogin: string },
	) {
		const { chatroomid, userlogin } = ChatRoomData;
		return this.ChatroomService.muteUser({
			chatroomid,
			userlogin
		});
	}

	@Post('unmute')
	async unmuteUser(
		@Body() ChatRoomData: { chatroomid: number, userlogin: string },
	): Promise<ChatRoomModel> {
		const { chatroomid, userlogin } = ChatRoomData;
		return this.ChatroomService.unmuteUser({
			chatroomid,
			userlogin
		});
	}

// BAN //
	@Get('banList')
	async banList(@Body() ChatRoomData: { chatroomid: number } ) {
		const {chatroomid} = ChatRoomData;
		return this.ChatroomService.banListByChatRoom(chatroomid);
	}

	@Post('ban')
	async banUser(
		@Body() ChatRoomData: { chatroomid: number, userlogin: string },
	) {
		const { chatroomid, userlogin } = ChatRoomData;
		this.ChatroomService.banUser({
			chatroomid,
			userlogin
		});
		return this.ChatroomService.banListByChatRoom(chatroomid);
	}

	@Post('unban')
	async unbanUser(
		@Body() ChatRoomData: { chatroomid: number, userlogin: string },
	): Promise<ChatRoomModel> {
		const { chatroomid, userlogin } = ChatRoomData;
		return this.ChatroomService.unbanUser({
			chatroomid,
			userlogin
		});
	}

}
