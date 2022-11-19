import {
	ConnectedSocket,
	MessageBody, OnGatewayConnection, OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {JwtPayload} from "jsonwebtoken";
import {JwtService} from "@nestjs/jwt";
import {jwtConstants} from "../auth/auth.constants";
import {PrismaService} from '../prisma/prisma.service';
import {SiteUser} from "./SiteUser";
import {GameServer} from "./GameServer";
import {Logger} from "./global.service";
import {UserService} from "../user/user.service";

@WebSocketGateway(5678, {cors: '*'})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	private server: Server;
	private _users: Set<SiteUser> = new Set<SiteUser>();
	private a = true;

	constructor(private jwtService: JwtService, private prisma: PrismaService, private readonly gameServer: GameServer,
				private readonly userService: UserService) {
	}

	/* CONNECTION / DISCONNECTION IMPLEMENTATIONS */

	async handleConnection(client: Socket) {
		if (!this.a) {
			setInterval(() => {
				console.log(this._users);
			}, 1000);
			this.a = true;
		}
		const token = String(client.handshake.query.token);
		this.add_user(client, new SiteUser(client, await this.getUserData(client, token)));
		this.updateServerInfo();
	}

	handleDisconnect(client: Socket) {
		let leavedUser = this.getUserBySocket(client);
		if (leavedUser == null)
			return ;
		if (leavedUser.is_logged) {
			if (leavedUser.is_playing && client == leavedUser.game_socket) {
				leavedUser.is_leaved = true;
			}
			if (leavedUser.is_searching)
				this.gameServer.deletePlayerFromQueue(leavedUser);
			if (leavedUser.is_waiting) {
				this.gameServer.deleteUserFromWaitingRoom(leavedUser);
				this.gameServer.declineWaitingGame(client, leavedUser);
			}
		}
		leavedUser.delete_socket(client);
		Logger.write("Deleted connection of " + leavedUser.nickname + ", current connections = " + leavedUser.connections_count());
		if (leavedUser.connections_count() == 0) {
			this._users.delete(leavedUser);
			if (leavedUser.is_logged)
				this.userService.updateStatus(leavedUser.login, "offline");
			Logger.write("disconnect --- " + (leavedUser.is_logged ? leavedUser.nickname : client.id));
		}
		this.updateServerInfo();
	}

	/*	SUBSCRIBE MESSAGES */

	/* SiteUser update after login, logout, personal data modifications */
	@SubscribeMessage('update-user-data')
	async updateUserData(@ConnectedSocket() client: Socket, @MessageBody() token: string) {
		let oldUser: SiteUser = this.getUserBySocket(client);
		let newUser: SiteUser = new SiteUser(client, await this.getUserData(client, token));
		try {
			if (oldUser.is_logged != newUser.is_logged) {
				this.gameServer.deletePlayerFromQueue(oldUser);
				oldUser.is_leaved = true;
				if (!oldUser.is_logged)
					Logger.write(client.id + " now is logged like " + newUser.nickname);
				else
					Logger.write(oldUser.nickname + " now is delogged like " + client.id);
				if (oldUser.is_logged)
					this.userService.updateStatus(oldUser.login, "offline");
				this._users.delete(oldUser);
				this.add_user(client, newUser);
			}
		} catch (e) {
		}
	}

	/*	Invite someone to play by nickname */
	@SubscribeMessage('game-invite')
	invite(@ConnectedSocket() client: Socket, @MessageBody() friends_nickname: string): void {
		let found: boolean = false;
		this._users.forEach((user) => {
			if (user.nickname == friends_nickname) {
				let host: SiteUser = this.getUserBySocket(client);
				found = true;
				if (this.gameServer.putUserInWaitingRoom(user, host, client)) {
					host.sendAllTabsMessage('game-invite-status', {status: "sent"});
					user.sendAllTabsMessage('game-invite', {inviter: this.getUserBySocket(client).nickname});
				}
				return;
			}
		});
		if (!found)
			client.emit('notification', {message: "Can't find " + friends_nickname + ", he is not online..."});
	}

	@SubscribeMessage('game-invite-delete')
	deleteInv(@ConnectedSocket() client: Socket): void {
		this.gameServer.deleteUserFromWaitingRoom(this.getUserBySocket(client));
	}

	/*	Accept invitation */
	@SubscribeMessage('game-invite-accept')
	acceptInv(@ConnectedSocket() client: Socket): void {
		this.gameServer.acceptWaitingGame(client, this.getUserBySocket(client));
	}

	/*	Decline invitation */
	@SubscribeMessage('game-invite-decline')
	declineInt(@ConnectedSocket() client: Socket): void {
		this.gameServer.declineWaitingGame(client, this.getUserBySocket(client));
	}

	/*	Press ready button */
	@SubscribeMessage('ready')
	ready(@ConnectedSocket() client: Socket): void {
		let user: SiteUser = this.getUserBySocket(client);
		if (user.is_logged) {
			user.is_ready = true;
			Logger.write(user.nickname + " is ready");
		}
	}

	/*	Leave from the game */
	@SubscribeMessage('exit-game')
	exitGame(@ConnectedSocket() client: Socket): void {
		let leavedUser = this.getUserBySocket(client);
		if (leavedUser.is_playing && client == leavedUser.game_socket) {
			leavedUser.is_leaved = true;
			leavedUser.is_playing = false;
		} else
			this.gameServer.deleteSpectator(client);
		this.updateServerInfo();
	}

	/*	Move game paddle */
	@SubscribeMessage('move-paddle')
	movePaddle(@MessageBody() direction: string, @ConnectedSocket() client: Socket): void {
		this.gameServer.movePaddle(this.getUserBySocket(client), direction);
	}

	/* Start or find a game */
	@SubscribeMessage('find-game')
	findGame(@ConnectedSocket() client: Socket): void {
		let user: SiteUser = this.getUserBySocket(client);
		if (!user.is_logged)
			client.emit('notification', {message: "You are not login"});
		else if (user.is_playing)
			client.emit('notification', {message: "You are already in game"});
		else if (user.is_waiting)
			client.emit('notification', {message: "You are waiting a game with someone"});
		else if (user.is_searching)
			client.emit('notification', {message: "You are already searching game"});
		else
			this.gameServer.addPlayerToQueue(client, user);
		this.updateServerInfo();
	}

	/*	Stop searching */
	@SubscribeMessage('find-game-stop')
	findGameStop(@MessageBody() profile: any, @ConnectedSocket() client: Socket): void {
		this.gameServer.deletePlayerFromQueue(this.getUserBySocket(client));
		this.updateServerInfo();
	}

	/*	Start spectating a match */
	@SubscribeMessage('spectate')
	spectateHandler(@MessageBody() nickname: any, @ConnectedSocket() client: Socket): void {
		this.gameServer.addSpectator(this.getUserBySocket(client), client, nickname);
	}

	/*	Get server statistics */
	@SubscribeMessage('get-games-list')
	gamesList(@ConnectedSocket() client: Socket): void {
		client.emit('get-games-list', this.gameServer, {players_online: this._users.size});
	}

	/* Methods */

	/* Send server info */
	public updateServerInfo(): void {
		this.server.emit('get-games-list', this.gameServer, {players_online: this._users.size});
	}

	/*	Get user data from db using jwt token */
	async getUserData(client: Socket, token: string) {
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
		return result;
	}

	/*	Identifying client like user. Supporting multiple connections in differents tabs */
	private add_user(client: Socket, user: SiteUser): void {
		let added: boolean = false;
		if (user.is_logged) {
			this._users.forEach((e) => {
				if (e.nickname == user.nickname) {
					added = true;
					e.add_socket(client)
					Logger.write(user.nickname + " has entered with another tab");
					return;
				}
			});
		}
		if (!added) {
			this._users.add(user);
			if (user.is_logged)
				this.userService.updateStatus(user.login, "online");
			Logger.write("connect --- " + (user.is_logged ? user.nickname : client.id));
		}
		this.updateServerInfo();
	}


	getUserBySocket(client: Socket): SiteUser {
		let result: SiteUser = null;
		this._users.forEach((v) => {
			if (v.have(client)) {
				result = v;
				return;
			}
		});
		return result;
	}
}