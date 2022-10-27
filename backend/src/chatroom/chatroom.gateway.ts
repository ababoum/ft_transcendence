import { Body, Logger, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { ChatRoom } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import {Socket, Server} from "socket.io";
import { jwtConstants } from "../auth/auth.constants";
import { UserService } from "../user/user.service";
import { ChatroomService } from './chatroom.service';
import { MessageDto } from './dto/message.dto';



@WebSocketGateway(5678, {cors: '*', namespace: "/chatroom"})
export class ChatRoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() wss: Server;

	private _interval;
	private logger: Logger = new Logger('ChatGateway');
	private chatRoomsList = [];
	private users: {connectionId: Socket, login: string, nickname: string}[] = [];

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
			this.users.push({connectionId: client, login: verified.username, nickname: user.nickname})
		}
		catch {
			this.logger.log("Disconnection because of bad token --- " + client.id);
			client.disconnect(true)
		}
	}

	handleDisconnect(client: Socket) {
		this.logger.log("disconnect --- " + client.id);
		this.users.splice(this.users.findIndex(x => x.connectionId.id),1)
	}

	async createChatroom(chatRoom: ChatRoom) {
		// Update this.chatRoomsList to add this chatRoom
		this.chatRoomsList.push(chatRoom)

		// Emit update to everyone
		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	async joinChatroom(user, chatRoomId: number) {
		//Update this.chatRoomsList to add this user as participant
		const chatRoomIndex = this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		this.chatRoomsList[chatRoomIndex].participants.push({login: user.login, nickname: user.nickname})
		
		// Emit update to everyone
		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	async leaveChatroom(user, chatRoomId: number) {
		//Update this.chatRoomsList to remove this user as participant
		const chatRoomIndex = this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		const userIndex = this.chatRoomsList[chatRoomIndex].participants.findIndex(x => x.login === user.login)
		this.chatRoomsList[chatRoomIndex].participants.splice(userIndex, 1)
		
		// Emit update to everyone
		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	async enterChatroom(user, chatRoomId: string) {
		const client = await this.users.find(x => x.login === user.login).connectionId

		// Join client to the room
		await client.join(chatRoomId);
	}

	async exitChatroom(user, chatRoomId: string) {
		console.log(user)
		const client = await this.users.find(x => x.login === user.login).connectionId

		// Join client to the room
		await client.leave(chatRoomId);
	}

	async postMessage(chatRoomId, message) {
		console.log("Trying to emit " + message + " to room " + chatRoomId)
		// Emit update to this room
		this.wss.to(chatRoomId).emit('message', message)
	}
}