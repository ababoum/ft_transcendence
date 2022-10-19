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
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/auth.guards';
import { UpdateChatRoomDto } from './dto/update-chatroom.dto ';
import { MessageDto } from './dto/message.dto';

@Controller('chatrooms')
@ApiTags('chatrooms')
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
	async createChatRoom(@Request() req, @Body() CreateChatRoomDto: CreateChatRoomDto) {
		console.log(req.user)
		return await this.ChatroomService.createChatRoom(req.user.login, CreateChatRoomDto)
	}

// PARTICIPANTS //
	@Get(':id/participantsList')
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
	@Get(':id/adminList')
	async admins(@Param('id') id: string) {
		return this.ChatroomService.adminsByChatRoom(+id);
	}

	@Patch(':id/adminUser')
	async adminUser(@Request() req, @Param('id') id: string, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		return this.ChatroomService.adminUser(req.user.login, +id, UpdateChatRoomDto);
	}

	@Patch(':id/unadminUser')
	async unadminUser(@Request() req, @Param('id') id: string, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		return this.ChatroomService.unadminUser(req.user.login, +id, UpdateChatRoomDto);
	}

// BAN //
	@Get(':id/banList')
	async banList(@Param('id') id: string) {
		return this.ChatroomService.banListByChatRoom(+id);
	}

	@Patch(':id/banUser')
	async banUser(@Request() req, @Param('id') id: string, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		return this.ChatroomService.banUser(req.user.login, +id, UpdateChatRoomDto);
	}

	@Patch(':id/unbanUser')
	async unbanUser(@Request() req, @Param('id') id: string, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		return this.ChatroomService.unbanUser(req.user.login, +id, UpdateChatRoomDto);
	}

// MUTE //
	@Get(':id/muteList')
	async muteList(@Param('id') id: string) {
		return this.ChatroomService.muteListByChatRoom(+id);
	}

	@Patch(':id/muteUser')
	async muteUser(@Request() req, @Param('id') id: string, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		return this.ChatroomService.muteUser(req.user.login, +id, UpdateChatRoomDto);
	}

	@Patch(':id/unmuteUser')
	async unmuteUser(@Request() req, @Param('id') id: string, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		return this.ChatroomService.unmuteUser(req.user.login, +id, UpdateChatRoomDto);
	}

// MESSAGES //
	@Get(':id/messages')
	async getMessages(@Param('id') id: string) {
		return this.ChatroomService.getMessages(+id);
	}

	@Post(':id/messages')
	async postMessage(@Request() req, @Param('id') id: string, @Body() MessageDto: MessageDto) {
		return this.ChatroomService.postMessage(req.user.login, +id, MessageDto);
	}
}
