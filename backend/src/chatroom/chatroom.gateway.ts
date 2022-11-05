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
			client.emit('chatrooms-list', this.chatRoomsList)
			//console.log(this.users)
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

	async addPassword(user, chatRoomId: number, res) {
		console.log("addPassword from " + user.nickname + " for room " + chatRoomId)

		const chatRoomIndex = await this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		this.chatRoomsList[chatRoomIndex].mode = await res.mode

		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	async changePassword(user, chatRoomId: number, res) {
		console.log("changePassword from " + user.nickname + " for room " + chatRoomId)

		const chatRoomIndex = await this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		this.chatRoomsList[chatRoomIndex].mode = await res.mode

		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	async removePassword(user, chatRoomId: number, res) {
		console.log("removePassword from " + user.nickname + " for room " + chatRoomId)

		const chatRoomIndex = await this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		this.chatRoomsList[chatRoomIndex].mode = await res.mode

		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	async joinChatroom(user, chatRoomId: number, res) {
		//Update this.chatRoomsList to add this user as participant
		const chatRoomIndex = await this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		this.chatRoomsList[chatRoomIndex].participants = res.participants
				
		// Emit update to everyone
		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	async leaveChatroom(user, chatRoomId: number, res) {
		//Update this.chatRoomsList to remove this user as participant
		const chatRoomIndex = await this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		this.chatRoomsList[chatRoomIndex].participants = res

		// Emit update to everyone
		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	async inviteUser(user, chatRoomId: number, res) {
		//Update this.chatRoomsList with the new list of participants
		const chatRoomIndex = await this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		this.chatRoomsList[chatRoomIndex].participants = res.participants

		// Emit update to everyone
		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	async enterChatroom(user, chatRoomId: string) {
		const client = await this.users.find(x => x.login === user.login).connectionId

		// Join client to the room
		await client.join(chatRoomId);

		this.logger.log(user.login + " entered the chatroom " + chatRoomId)
	}

	async exitChatroom(user, chatRoomId: string) {
		const client = await this.users.find(x => x.login === user.login).connectionId

		// Join client to the room
		await client.leave(chatRoomId);

		this.logger.log(user.login + " exited the chatroom " + chatRoomId)
	}

	async adminUser(chatRoomId: number, nickname, res) {
		console.log("adminUser " + nickname + " from room " + chatRoomId)
		console.log(res)

		const chatRoomIndex = await this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		this.chatRoomsList[chatRoomIndex].admin = await res.admin
		this.chatRoomsList[chatRoomIndex].participants = await res.participants

		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	async unadminUser(chatRoomId: number, nickname, res) {
		console.log("unadminUser " + nickname + " from room " + chatRoomId)
		console.log(res)

		const chatRoomIndex = await this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		this.chatRoomsList[chatRoomIndex].admin = await res.admin

		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	async banUser(chatRoomId: number, nickname, res) {
		console.log("banUser " + nickname + " from room " + chatRoomId)
		console.log(res)

		const chatRoomIndex = await this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		this.chatRoomsList[chatRoomIndex].banList = await res.banList
		this.chatRoomsList[chatRoomIndex].participants = await res.participants

		this.wss.emit('chatrooms-list', this.chatRoomsList)

		const client = await this.users.find(x => x.nickname === nickname)
		if (client){
			await client.connectionId.leave(String(chatRoomId))
			client.connectionId.emit('you-have-been-banned', chatRoomId)
		}

	}

	async unbanUser(chatRoomId: number, nickname, res) {
		console.log("unbanUser " + nickname + " from room " + chatRoomId)
		console.log(res)

		const chatRoomIndex = await this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		this.chatRoomsList[chatRoomIndex].banList = await res.banList

		await this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	async muteUser(chatRoomId: number, nickname, res) {
		console.log("muteUser " + nickname + " from room " + chatRoomId)

		const chatRoomIndex = await this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		const alreadyMutedIndex = await this.chatRoomsList[chatRoomIndex].muteList.findIndex(x => x.user.nickname === res.nickname)
		if (alreadyMutedIndex != -1)
			this.chatRoomsList[chatRoomIndex].muteList[alreadyMutedIndex].mutedUntil = await res.mutedUntil
		else
			await this.chatRoomsList[chatRoomIndex].muteList.push({ user: {id: undefined, nickname: res.nickname}, mutedUntil: res.mutedUntil})

		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	async unmuteUser(chatRoomId: number, nickname, res) {
		console.log("unmuteUser " + nickname + " from room " + chatRoomId)

		const chatRoomIndex = await this.chatRoomsList.findIndex(x => x.id === chatRoomId)
		const alreadyMutedIndex = await this.chatRoomsList[chatRoomIndex].muteList.findIndex(x => x.user.nickname === res.nickname)
		await this.chatRoomsList[chatRoomIndex].muteList.splice(alreadyMutedIndex, 1)
		// this.chatRoomsList[chatRoomIndex].admin = await res.admin

		this.wss.emit('chatrooms-list', this.chatRoomsList)
	}

	async postMessage(chatRoomId, message) {
		console.log("Trying to emit " + message + " to room " + chatRoomId)
		// Emit update to this room
		this.wss.to(chatRoomId).emit('message', message)
	}
}