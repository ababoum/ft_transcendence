import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	UseGuards,
	Request,
	Patch,
	Logger,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatRoomDto } from './dto/create-chatroom.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guards';
import { UpdateChatRoomDto } from './dto/update-chatroom.dto ';
import { MessageDto } from './dto/message.dto';
import { ChatRoomGateway } from './chatroom.gateway';
import { CreateDirectMessagesRoomDto } from './dto/create-directmessagesroom.dto';

@Controller('chatrooms')
@ApiTags('chatrooms')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatroomController {

	constructor(private readonly ChatroomService: ChatroomService,
		private readonly ChatroomGateway: ChatRoomGateway) { }

	private logger: Logger = new Logger('ChatController');

	@Get()
	async findAllChatRooms() {
		return this.ChatroomService.chatRooms({});
	}

/////////////////////DM/////////////////////////////////////////////////////////////////////////////////////////////////////
	@Get('directmessages')
	async findAllDirectMessagesRooms() {
		return this.ChatroomService.DirectMessagesRooms({});
	}

	@Post('directmessages')
	async createDirectMessagesRoom(@Request() req, @Body() CreateDirectMessagesRoomDto: CreateDirectMessagesRoomDto) {
		const res = await this.ChatroomService.createDirectMessagesRoom(req.user.login, CreateDirectMessagesRoomDto)
		await this.ChatroomGateway.createDirectMessagesRoom(res)
		return res;
	}

	// PARTICIPANTS //
	@Get('directmessages/:id/participantsList')
	async participantsDirectMessagesRoom(@Param('id') id: number) {
		return this.ChatroomService.participantsByDirectMessagesRoom(+id);
	}

	@Patch('directmessages/:id/exit')
	async exitDirectMessagesRoom(@Request() req, @Param('id') id: number, @Body() socketId) {
		const res = await this.ChatroomGateway.exitDirectMessagesRoom(req.user, String(id), socketId.id)
		return res
	}

	// MESSAGES //
	@Patch('directmessages/:id/messages')
	async getDirectMessages(@Request() req, @Param('id') id: number, @Body() socketId) {
		const res = await this.ChatroomService.getDirectMessages(req.user.login, +id);
		await this.ChatroomGateway.enterDirectMessagesRoom(req.user.login, String(id), socketId.id)
		return res
	}

	@Post('directmessages:id/messages')
	async postDirectMessage(@Request() req, @Param('id') id: number, @Body() MessageDto: MessageDto) {
		const res = await this.ChatroomService.postDirectMessage(req.user.login, +id, MessageDto);
		await this.ChatroomGateway.postDirectMessage(id, res)
		return res;
	}

/////////////////////DM/////////////////////////////////////////////////////////////////////////////////////////////////////


	@Get(':id')
	async findOneChatRoom(@Param('id') id: number) {
		return this.ChatroomService.chatRoom({ id: Number(id) });
	}

 	@Post()
	async createChatRoom(@Request() req, @Body() CreateChatRoomDto: CreateChatRoomDto) {
		const res = await this.ChatroomService.createChatRoom(req.user.login, CreateChatRoomDto)
		await this.ChatroomGateway.createChatroom(res)
		return res;
	}

	@Patch(':id/addPassword')
	async addPassword(@Request() req, @Param('id') id: number, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.ChatroomService.addPassword(req.user.login, +id, UpdateChatRoomDto);
		await this.ChatroomGateway.addPassword(Number(id), res)
		return res;
	}

	@Patch(':id/changePassword')
	async changePassword(@Request() req, @Param('id') id: number, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.ChatroomService.changePassword(req.user.login, +id, UpdateChatRoomDto);
		await this.ChatroomGateway.changePassword(Number(id), res)
		return res;
	}

	@Patch(':id/removePassword')
	async removePassword(@Request() req, @Param('id') id: number) {
		const res = await this.ChatroomService.removePassword(req.user.login, +id);
		await this.ChatroomGateway.removePassword(Number(id), res)
		return res;
	}

// PARTICIPANTS //
	@Get(':id/participantsList')
	async participants(@Param('id') id: number) {
		return this.ChatroomService.participantsByChatRoom(+id);
	}

	@Patch(':id/join')
	async join(@Request() req, @Param('id') id: number) {
		const res = await this.ChatroomService.joinChatRoom(req.user.login, +id);
		await this.ChatroomGateway.joinChatroom(Number(id), res)
		return res;
	}

	@Patch(':id/joinProtected')
	async joinProtected(@Request() req, @Param('id') id: number, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.ChatroomService.joinProtectedChatRoom(req.user.login, +id, UpdateChatRoomDto.password);
		await this.ChatroomGateway.joinChatroom(Number(id), res)
		return res;
	}

	@Patch(':id/leave')
	async leave(@Request() req, @Param('id') id: number) {
		const res = await this.ChatroomService.leaveChatRoom(req.user.login, +id);
		await this.ChatroomGateway.leaveChatroom(Number(id), res)
		return res.participants;
	}

	@Patch(':id/invite')
	async inviteUser(@Request() req, @Param('id') id: number, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.ChatroomService.inviteUser(req.user.login, +id, UpdateChatRoomDto.nickname);
		await this.ChatroomGateway.inviteUser(Number(id), res)
		return res;
	}

	@Patch(':id/kick')
	async kickUser(@Request() req, @Param('id') id: number, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.ChatroomService.kickUser(req.user.login, +id, UpdateChatRoomDto.nickname);
		await this.ChatroomGateway.kickUser(Number(id), UpdateChatRoomDto.nickname, res)
		return res;
	}

	@Patch(':id/exit')
	async exitRoom(@Request() req, @Param('id') id: number, @Body() socketId) {
		const res = await this.ChatroomGateway.exitChatroom(req.user, String(id), socketId.id)
		return res
	}

// ADMIN //
	@Get(':id/adminList')
	async admins(@Param('id') id: number) {
		return this.ChatroomService.adminsByChatRoom(+id);
	}

	@Patch(':id/adminUser')
	async adminUser(@Request() req, @Param('id') id: number, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.ChatroomService.adminUser(req.user.login, +id, UpdateChatRoomDto);
		await this.ChatroomGateway.adminUser(Number(id), res)
		return res
	}

	@Patch(':id/unadminUser')
	async unadminUser(@Request() req, @Param('id') id: number, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.ChatroomService.unadminUser(req.user.login, +id, UpdateChatRoomDto);
		await this.ChatroomGateway.unadminUser(Number(id), res)
		return res
	}

// BAN //
	@Get(':id/banList')
	async banList(@Param('id') id: number) {
		return this.ChatroomService.banListByChatRoom(+id);
	}

	@Patch(':id/banUser')
	async banUser(@Request() req, @Param('id') id: number, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.ChatroomService.banUser(req.user.login, +id, UpdateChatRoomDto);
		await this.ChatroomGateway.banUser(Number(id), UpdateChatRoomDto.nickname, res)
		return res.participants;
	}

	@Patch(':id/unbanUser')
	async unbanUser(@Request() req, @Param('id') id: number, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.ChatroomService.unbanUser(req.user.login, +id, UpdateChatRoomDto);
		await this.ChatroomGateway.unbanUser(Number(id), res)
		return res;
	}

// MUTE //
	@Get(':id/muteList')
	async muteList(@Param('id') id: number) {
		return this.ChatroomService.muteListByChatRoom(+id);
	}

	@Patch(':id/muteUser')
	async muteUser(@Request() req, @Param('id') id: number, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.ChatroomService.muteUser(req.user.login, +id, UpdateChatRoomDto);
		await this.ChatroomGateway.muteUser(Number(id), res)
		return res
	}

	@Patch(':id/unmuteUser')
	async unmuteUser(@Request() req, @Param('id') id: number, @Body() UpdateChatRoomDto: UpdateChatRoomDto) {
		const res = await this.ChatroomService.unmuteUser(req.user.login, +id, UpdateChatRoomDto);
		await this.ChatroomGateway.unmuteUser(Number(id), res)
		return res
	}

// MESSAGES //
	@Patch(':id/messages')
	async getMessages(@Request() req, @Param('id') id: number, @Body() socketId) {
		const res = await this.ChatroomService.getMessages(req.user.login, +id);
		await this.ChatroomGateway.enterChatroom(req.user, String(id), socketId.id)
		return res
	}

	@Post(':id/messages')
	async postMessage(@Request() req, @Param('id') id: number, @Body() MessageDto: MessageDto) {
		const res = await this.ChatroomService.postMessage(req.user.login, +id, MessageDto);
		await this.ChatroomGateway.postMessage(id, res)
		return res;
	}

}
