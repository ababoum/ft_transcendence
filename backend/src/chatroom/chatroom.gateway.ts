import { Logger } from "@nestjs/common";
import {ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { ChatRoom } from "@prisma/client";
import {Socket, Server} from "socket.io";
import { ChatroomService } from './chatroom.service';


@WebSocketGateway(5678, {cors: '*', namespace: '/chatroom'})
export class ChatRoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() wss: Server;

	private _interval;
	private logger: Logger = new Logger('ChatGateway');
	private chatRoomsList;

	constructor(private readonly ChatroomService: ChatroomService) {
		//this._interval = setInterval(() => this.emitChatRoomsList(), 10000);
	}

	async afterInit(server: any) {
		this.logger.log('Initialized!');
		this.chatRoomsList = await this.ChatroomService.chatRooms({})
		console.log(this.chatRoomsList);
	 }

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log("connect --- " + client.id);
		this.emitChatRoomsList();
	}

	handleDisconnect(client: Socket) {
		this.logger.log("disconnect --- " + client.id);		
	}

	emitChatRoomsList() {
		this.wss.emit('chatrooms-list', this.chatRoomsList);
		this.logger.log("emitChatRoomsList()" + this.chatRoomsList);		
	}

	@SubscribeMessage('get-chatrooms-list')
	handleMessage(client: Socket,): void {
	}	

}