import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { JwtPayload } from "jsonwebtoken";
import {Socket, Server} from "socket.io";
import { jwtConstants } from "../auth/auth.constants";
import { UserService } from "../user/user.service";
import { ChatroomService } from './chatroom.service';
import { CreateChatRoomDto } from "./dto/create-chatroom.dto";

@WebSocketGateway(5678, {cors: '*', namespace: "/chatroom"})
export class ChatRoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() wss: Server;

	private _interval;
	private logger: Logger = new Logger('ChatGateway');
	private chatRoomsList;
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

	@SubscribeMessage('create-chatroom')
	async createChatroom(client: Socket, CreateChatRoomDto:CreateChatRoomDto) {
		const user = this.users[this.users.findIndex(x => x.connectionId === client.id)]

		this.logger.log("Create-chatroom request from " + user.login)
		const res = await this.ChatroomService.createChatRoom(user.login, CreateChatRoomDto)
		this.chatRoomsList.push(res)
		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	@SubscribeMessage('join-room')
	handleMessage(client: Socket, room: string): void {
		client.join(room);
	}

}