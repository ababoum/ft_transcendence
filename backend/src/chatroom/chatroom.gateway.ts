import { Body, Logger, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { JwtPayload } from "jsonwebtoken";
import {Socket, Server} from "socket.io";
import { jwtConstants } from "../auth/auth.constants";
import { UserService } from "../user/user.service";
import { ChatroomService } from './chatroom.service';
import { CreateChatRoomDto } from "./dto/create-chatroom.dto";
import { MessageDto } from './dto/message.dto';



@WebSocketGateway(5678, {cors: '*', namespace: "/chatroom"})
export class ChatRoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() wss: Server;

	private _interval;
	private logger: Logger = new Logger('ChatGateway');
	private chatRoomsList = [];
	private users: {connectionId: string, login: string, nickname: string}[] = [];

	constructor(private readonly ChatroomService: ChatroomService,
				private readonly JwtService: JwtService,
				private readonly UserService: UserService) {}

	async afterInit(server: any) {
		this.logger.log('Initialized!');
		this.chatRoomsList = await this.ChatroomService.chatRooms({})
		console.log(this.chatRoomsList);
	 }

	async handleConnection(client: Socket) {
		const token = String(client.handshake.query.token);
		this.logger.log("Connection identified by " + client.id)

		try {
			const verified: JwtPayload = this.JwtService.verify(token, {secret: jwtConstants.secret})
			this.logger.log("User authenticated: " + verified.username);
			client.emit('chatrooms-list', this.chatRoomsList);
			const user = await this.UserService.user({login: verified.username})
			this.users.push({connectionId: client.id, login: verified.username, nickname: user.nickname})
		}
		catch {
			this.logger.log("Disconnection because of bad token --- " + client.id);
			client.disconnect(true)
		}
	}

	handleDisconnect(client: Socket) {
		this.logger.log("disconnect --- " + client.id);
		this.users.splice(this.users.map(object => object.connectionId).indexOf(client.id),1)
	}

	@SubscribeMessage('get-chatrooms-list')
	sendChatroomsList(client: Socket): void {
		client.emit('chatrooms-list', this.chatRoomsList);
	}

	@UsePipes(new ValidationPipe())
	@SubscribeMessage('create-chatroom')
	async createChatroom(client: Socket, CreateChatRoomDto:CreateChatRoomDto) {
		// Retrieve informations about the user sending the request
		const user = this.users[this.users.findIndex(x => x.connectionId === client.id)]
		this.logger.log("create-chatroom request from " + user.login)

		// Update DB to create this chatRoom
		const res = await this.ChatroomService.createChatRoom(user.login, CreateChatRoomDto)

		// Update this.chatRoomsList to add this user as participant
		this.chatRoomsList.push(res)

		// Emit update to everyone
		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	@SubscribeMessage('join-chatroom')
	async joinChatroom(client: Socket, chatRoomId: number) {
		// Retrieve informations about the user sending the request
		const user = this.users[this.users.findIndex(x => x.connectionId === client.id)]
		this.logger.log("join-chatroom request from " + user.login + " to chatRoom " + chatRoomId)

		// Update DB to add this user as participant
		const res = await this.ChatroomService.joinChatRoom(user.login, chatRoomId)

		// Update this.chatRoomsList to add this user as participant
		const chatRoomIndex = this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		this.chatRoomsList[chatRoomIndex].participants.push({login: user.login, nickname: user.nickname})
		
		// Emit update to everyone
		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	@SubscribeMessage('leave-chatroom')
	async leaveChatroom(client: Socket, chatRoomId: number) {
		// Retrieve informations about the user sending the request
		const user = this.users[this.users.findIndex(x => x.connectionId === client.id)]
		this.logger.log("leave-chatroom request from " + user.login + " to chatRoom " + chatRoomId)

		// Update DB to add this user as participant
		const res = await this.ChatroomService.leaveChatRoom(user.login, chatRoomId)

		//Update this.chatRoomsList to remove this user as participant
		const chatRoomIndex = this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		const userIndex = this.chatRoomsList[chatRoomIndex].participants.findIndex(x => x.login === user.login)
		this.chatRoomsList[chatRoomIndex].participants.splice(userIndex, 1)
		
		// Emit update to everyone
		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	@SubscribeMessage('enter-chatroom')
	async enterChatroom(client: Socket, chatRoomId: string) {
		// Retrieve informations about the user sending the request
		const user = this.users[this.users.findIndex(x => x.connectionId === client.id)]
		this.logger.log("enter-chatroom request from " + user.login + " to chatRoom " + chatRoomId)

		// Retrieve messages from this chatRoom
		const res = await this.ChatroomService.getMessages(Number(chatRoomId))

		// Emit messages to the client
		client.emit('messages-list', res.messages)		

		// Join client to the room
		client.join(chatRoomId);
	}

	@UsePipes(new ValidationPipe())
	@SubscribeMessage('post-message')
	async postMessage(@ConnectedSocket() client: Socket, MessageDto: MessageDto) {
		console.log(MessageDto)
		// Retrieve informations about the user sending the request
		const user = this.users[this.users.findIndex(x => x.connectionId === client.id)]
		this.logger.log("post-message request from " + user.login + " to chatRoom " + MessageDto.chatRoomId)

		// Update DB to add this message to the chatRoom
		//const res = await this.ChatroomService.postMessage(user.login, payload.chatRoomId, payload.MessageDto)

		// Emit update to this room
	}

}