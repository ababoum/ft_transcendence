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

	constructor(private jwtService: JwtService, private prisma: PrismaService, private readonly gameServer: GameServer,
				private readonly userService: UserService) {
	}

	/* CONNECTION / DISCONNECTION IMPLEMENTATIONS */

	async handleConnection(client: Socket) {
		const token = String(client.handshake.query.token);
		this.add_user(client, new SiteUser(client, await this.getUserData(client, token)));
		this.updateServerInfo();
	}

	handleDisconnect(client: Socket) {
		let user = this.get_user_by_socket(client);
		try {
			if (user.game_socket == client) {
				this.gameServer.deletePlayerFromQueue(user);
				this.get_user_by_socket(client).is_leaved = true;
			}
		} catch (e) {
		}
		this.updateServerInfo();
		user.delete_socket(client)
		Logger.write("Deleted connection of " + user.nickname + ", current connections = " + user.connections_count());
		if (user.connections_count() == 0) {
			this._users.delete(user);
			this.userService.updateStatus(user.login, "offline");
			Logger.write("disconnect --- " + (user.is_logged ? user.nickname : client.id));
		}
		this.updateServerInfo();
	}

	/*	SUBSCRIBE MESSAGES */

	/* SiteUser update after login, logout, personal data modifications */
	@SubscribeMessage('update-user-data')
	async updateUserData(@ConnectedSocket() client: Socket, @MessageBody() token: string) {
		let oldUser: SiteUser = this.get_user_by_socket(client);
		let newUser: SiteUser = new SiteUser(client, await this.getUserData(client, token));
		try {
			if (oldUser.is_logged != newUser.is_logged) {
				this.gameServer.deletePlayerFromQueue(oldUser);
				oldUser.is_leaved = true;
				if (!oldUser.is_logged)
					Logger.write(client.id + " now is logged like " + newUser.nickname);
				else
					Logger.write(oldUser.nickname + " now is delogged like " + client.id);
				this._users.delete(oldUser);
				this.add_user(client, newUser);
			}
		} catch (e) {
		}
	}

	/*	Invite someone to play by nickname */
	@SubscribeMessage('game-invite')
	invite(@ConnectedSocket() client: Socket, @MessageBody() nickname: string): void {
		this._users.forEach((element) => {
			if (element.nickname == nickname) {
				client.emit('game-invite-status', {status: "sent"});
				element.sendAllTabsMessage('game-invite', {inviter: this.get_user_by_socket(client).nickname});
				this.gameServer.putUserInWaitingRoom(nickname, client, this.get_user_by_socket(client));
				return;
			}
		});
	}

	@SubscribeMessage('game-invite-delete')
	deleteInv(@ConnectedSocket() client: Socket): void {
		this.gameServer.deleteUserFromWaitingRoom(this.get_user_by_socket(client));
		client.emit('game-invite-status', {status: "annulled"});
	}

	/*	Accept invitation */
	@SubscribeMessage('game-invite-accept')
	acceptInv(@ConnectedSocket() client: Socket): void {
		this.gameServer.acceptWaitingGame(client, this.get_user_by_socket(client));
	}

	/*	Decline invitation */
	@SubscribeMessage('game-invite-decline')
	declineInt(@ConnectedSocket() client: Socket): void {
		this.gameServer.declineWaitingGame(client, this.get_user_by_socket(client));
	}

	/*	Press ready button */
	@SubscribeMessage('ready')
	ready(@ConnectedSocket() client: Socket): void {
		let user: SiteUser = this.get_user_by_socket(client);
		if (user.is_logged) {
			user.is_ready = true;
			Logger.write(user.nickname + " is ready");
		}
	}

	/*	Leave from the game */
	@SubscribeMessage('exit-game')
	exitGame(@ConnectedSocket() client: Socket): void {
		this.get_user_by_socket(client).is_leaved = true;
		this.updateServerInfo();
	}

	/*	Move game paddle */
	@SubscribeMessage('move-paddle')
	movePaddle(@MessageBody() direction: string, @ConnectedSocket() client: Socket): void {
		this.gameServer.movePaddle(this.get_user_by_socket(client), direction);
	}

	/* Start or find a game */
	@SubscribeMessage('find-game')
	findGame(@ConnectedSocket() client: Socket): void {
		let user: SiteUser = this.get_user_by_socket(client);
		if (!user.is_logged)
			client.emit('find-game-error', "You are not login");
		else if (user.is_playing)
			client.emit('find-game-error', "You are already in game");
		else if (user.is_waiting)
			client.emit('find-game-error', "You are waiting a game with friend");
		else if (user.is_searching)
			client.emit('find-game-error', "You are already searching game");
		else {
			client.emit('find-game-error', "");
			this.gameServer.addPlayerToQueue(client, user);
		}
		this.updateServerInfo();
	}

	/*	Stop searching */
	@SubscribeMessage('find-game-stop')
	findGameStop(@MessageBody() profile: any, @ConnectedSocket() client: Socket): void {
		this.gameServer.deletePlayerFromQueue(this.get_user_by_socket(client));
		this.updateServerInfo();
	}

	/*	Start spectating a match */
	@SubscribeMessage('spectate')
	spectateHandler(@MessageBody() nickname: any, @ConnectedSocket() client: Socket): void {
		this.gameServer.addSpectator(this.get_user_by_socket(client), client, nickname);
	}

	/*	Get server statistics */
	@SubscribeMessage('get-games-list')
	gamesList(@ConnectedSocket() client: Socket): void {
		client.emit('get-games-list', this.gameServer, {players_online: this._users.size});
	}

	public updateServerInfo(): void {
		this.server.emit('get-games-list', this.gameServer, {players_online: this._users.size});
	}

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

	private add_user(client: Socket, user: SiteUser): void {
		let added: boolean = false;
		this._users.forEach((e) => {
			if (e.nickname == user.nickname) {
				added = true;
				e.add_socket(client)
				Logger.write(user.nickname + " has entered with another tab");
				return;
			}
		});
		if (!added) {
			this._users.add(user);
			this.userService.updateStatus(user.login, "online");
			console.log("connect --- " + (user.is_logged ? user.nickname : client.id));
		}
		this.updateServerInfo();
	}

	get_user_by_socket(client: Socket): SiteUser {
		let result: SiteUser;
		this._users.forEach((v) => {
			if (v.have(client)) {
				result = v;
				return;
			}
		});
		return result;
	}

	getUserByNickname(nickname: String): SiteUser {
		let res: SiteUser;
		this._users.forEach((v) => {
			if (v.nickname == nickname) {
				res = v;
				return;
			}
		});
		return res;
	}

}