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
	HttpException,
	Injectable,
	Scope,
	UseGuards,
	Req,
	Request,
	Patch,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatRoom as ChatRoomModel, Prisma } from '@prisma/client';
import { User as UserModel } from '@prisma/client';
import { chatRoomType } from '@prisma/client';
import { CreateChatRoomDto } from './dto/create-chatroom.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/auth.guards';

@Controller('chatroom')
@ApiTags('chatroom')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatroomController {

	constructor(private readonly ChatroomService: ChatroomService) { }

	@Get()
	async findAllChatRooms() {
		return this.ChatroomService.chatRooms({});
	}

	@Get(':id')
	async findOneChatRoom(@Param('id') id: string) {
		return this.ChatroomService.chatRoom({ id: Number(id) });
	}

 	@Post()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	async createChatRoom(@Request() req, @Body() CreateChatRoomDto: CreateChatRoomDto) {
		console.log(req.user)
		return await this.ChatroomService.createChatRoom(req.user.login, CreateChatRoomDto)
	}

// PARTICIPANTS //
	@Get(':id/participants')
	async participants(@Param('id') id: string) {
		return this.ChatroomService.participantsByChatRoom(+id);
	}

	@Patch(':id/join')
	async join(@Request() req, @Param('id') id: string) {
		return this.ChatroomService.joinChatRoom(req.user.login, +id);
	}

	@Patch(':id/leave')
	async leave(@Request() req, @Param('id') id: string) {
		return this.ChatroomService.leaveChatRoom(req.user.login, +id);
	}

// ADMIN //
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
		await this.ChatroomService.muteUser({
			chatroomid,
			userlogin
		});
		return this.ChatroomService.muteListByChatRoom(chatroomid);
	}

	@Post('unmute')
	async unmuteUser(
		@Body() ChatRoomData: { chatroomid: number, userlogin: string },
	) {
		const { chatroomid, userlogin } = ChatRoomData;
		await this.ChatroomService.unmuteUser({
			chatroomid,
			userlogin
		});
		return this.ChatroomService.muteListByChatRoom(chatroomid);
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
