import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Socket} from "socket.io";
import {JwtPayload} from "jsonwebtoken";
import {JwtService} from "@nestjs/jwt";
import {jwtConstants} from "../auth/auth.constants";
import {PrismaService} from '../prisma/prisma.service';
import {SiteUser} from "./SiteUser";
import {GameServer} from "./GameServer";

@WebSocketGateway(5678, {cors: '*'})
export class GameGateway {
	@WebSocketServer()
	private server: any;
	private _gameServer: GameServer;
	private _interval;
	private _users: Map<Socket, SiteUser>


	constructor(private jwtService: JwtService, private prisma: PrismaService) {
		this._users = new Map();
		this._gameServer = new GameServer();
		this._interval = setInterval(() => {
			this.server.emit('get-games-list', this._gameServer, {players_online: this._users.size});
		}, 1000);
	}

	async handleConnection(client: Socket) {
		console.log("connect --- " + client.id);
		const token = String(client.handshake.query.token);
		let result;
		try {
			let verified: JwtPayload = this.jwtService.verify(token, {secret: jwtConstants.secret})
			result = await this.prisma.user.findUnique({
				where: {login: verified.username},
				select: {
					login: true,
					nickname: true,
				}
			});
		} catch {
		}
		this._users.set(client, new SiteUser(client, result));
	}

	handleDisconnect(client: Socket) {
		console.log("disc --- " + client.id);
		this._gameServer.deletePlayerFromQueue(this._users.get(client));
		if (this._users.get(client).is_playing) {
			this._users.get(client).is_leaved = true;
		}
		this._users.delete(client);
	}

	@SubscribeMessage('game-invite')
	invite(@ConnectedSocket() client: Socket, @MessageBody() login: string): void {
		this._users.forEach((element) => {
			if (element.login == login) {
				element.sendMessage('game-invite', {inviter: this._users.get(client).nickname});
				this._gameServer.putUserInWaitingRoom(login, this._users.get(client));
				return;
			}
		});
	}

	@SubscribeMessage('game-invite-accept')
	acceptInv(@ConnectedSocket() client: Socket): void {
		this._gameServer.acceptWaitingGame(this._users.get(client));
	}

	@SubscribeMessage('game-invite-decline')
	declineInt(@ConnectedSocket() client: Socket): void {
		this._gameServer.declineWaitingGame(this._users.get(client));
	}

	@SubscribeMessage('ready')
	ready(@ConnectedSocket() client: Socket): void {
		if (this._users.get(client).is_logged)
			this._users.get(client).gameData.is_ready = true;
	}

	@SubscribeMessage('exit-game')
	exitGame(@ConnectedSocket() client: Socket): void {
		this._users.get(client).is_leaved = true;
	}

	@SubscribeMessage('get-games-list')
	initGameList(@ConnectedSocket() client: Socket): void {
		client.emit('get-games-list', this._gameServer);
	}

	@SubscribeMessage('move-paddle')
	movePaddle(@MessageBody() direction: string, @ConnectedSocket() client: Socket): void {
		this._gameServer.movePaddle(this._users.get(client), direction);
	}


	@SubscribeMessage('find-game')
	findGame(@ConnectedSocket() client: Socket): void {
		if (this._users.get(client).is_logged)
			this._gameServer.addPlayerToQueue(this._users.get(client));
	}


	@SubscribeMessage('find-game-stop')
	findGameStop(@MessageBody() profile: any, @ConnectedSocket() client: Socket): void {
		this._gameServer.deletePlayerFromQueue(this._users.get(client));
	}

	@SubscribeMessage('spectate')
	spectateHandler(@MessageBody() login: any, @ConnectedSocket() client: Socket): void {
		this._gameServer.addSpectator(this._users.get(client), login);
	}
}