import { Socket } from "socket.io";
import { SiteUser } from "./SiteUser";
import { GameRoom } from "./GameRoom";
import { Logger } from "./global.service";
import { Game } from "./Game";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { UserService } from "../user/user.service";
import { MatchService } from "../match/match.service";

@Injectable()
export class GameServer {
	private _queue: Set<SiteUser>;
	private _rooms: Set<GameRoom>;
	/*						*Map<Invitee, Host>*/
	private _waiting_room: Map<SiteUser, SiteUser>;
	private static readonly fps = 100;
	private _interval;

	constructor(
		@Inject(forwardRef(() => GameGateway)) private readonly gameGateway: GameGateway,
		private readonly userService: UserService,
		private matchService: MatchService) {
		this._rooms = new Set();
		this._waiting_room = new Map();
		this._queue = new Set();
	}

	/* Creates a game room with 2 players, updates their status and starts update interval*/
	private createRoom(player1: SiteUser, player2: SiteUser) {
		let room: GameRoom = new GameRoom(player1, player2);
		this._rooms.add(room);
		this.gameGateway.updateServerInfo();
		this.userService.updateStatus(player1.login, 'in-game');
		this.userService.updateStatus(player2.login, 'in-game');

		if (this._interval == undefined)
			this._interval = setInterval((rooms) => {
				rooms.forEach((val, key, set) => {
					val.update();
					if (val.isFinished()) {
						this.write_result_in_db(val);
						val.endGame();
						this.userService.updateStatus(val.player1.login, 'online');
						this.userService.updateStatus(val.player2.login, 'online');
						set.delete(key);
						this.gameGateway.updateServerInfo();
					}
				});
			}, 1000 / GameServer.fps, this._rooms);
	}

	/* Adds player in queue and starts game if they are 2+ players */
	public addPlayerToQueue(client: Socket, siteUser: SiteUser): void {
		siteUser.game_socket = client;
		siteUser.is_searching = true;
		this._queue.add(siteUser);
		siteUser.sendMessage('find-game', { status: 'searching' });
		Logger.write("Client " + siteUser.nickname + " is searching a game\nQueue size is " + this._queue.size);
		if (this._queue.size == 2) {
			let iter = this._queue.keys();
			this.createRoom(iter.next().value, iter.next().value);
			this._queue.clear();
			Logger.write("Players in queue " + this._queue.size);
		}
		this.gameGateway.updateServerInfo();
	}

	/*	Finds a match by nickname and adds spectator */
	addSpectator(siteUser: SiteUser, client: Socket, nickname: any) {
		this._rooms.forEach((element) => {
			if (element.check_nickname(nickname)) {
				element.addSpectator(siteUser, client);
				return;
			}
		});
	}

	/*	Delete user from queue */
	public deletePlayerFromQueue(siteUser: SiteUser) {
		if (this._queue.delete(siteUser)) {
			siteUser.resetData();
			Logger.write(siteUser.nickname + " has been deleted from queue\nQueue size is " + this._queue.size);
			this.gameGateway.updateServerInfo();
		}
	}

	/* Finds match by site user object and call move puddle method */
	public movePaddle(siteUser: SiteUser, direction: string): void {
		this._rooms.forEach(element => {
			if (element.has(siteUser)) {
				element.movePaddle(siteUser, direction);
				return;
			}
		});
	}

	/*	Puts user in waiting room for waiting his friend */
	public putUserInWaitingRoom(invitee: SiteUser, host: SiteUser, hostSocket: Socket): boolean {
		if (this.areAbleToPlay(invitee, host, hostSocket)) {
			this._waiting_room.set(invitee, host);
			host.game_socket = hostSocket;
			host.is_waiting = true;
			invitee.is_waiting = true;
			Logger.write(host.nickname + " has invited " + invitee.nickname + " to play");
			return true;
		}
		return false;
	}

	/*	Deletes player for waiting room */
	public deleteUserFromWaitingRoom(host: SiteUser): void {
		if (host.is_waiting) {
			host.is_waiting = false;
			host.sendAllTabsMessage('game-invite-status', {status: "annulled"});
			this._waiting_room.forEach((v, invitee, array) => {
				if (v == host) {
					Logger.write(host.nickname + " has been deleted from waiting friend room");
					invitee.is_waiting = false;
					invitee.sendAllTabsMessage('close-invitation', {});
					host.sendAllTabsMessage('game-invite-status', {status: "annulled"});
					array.delete(invitee);
					return;
				}
			});
		}
	}

	/* Starts friends game */
	public acceptWaitingGame(inviteeSocket: Socket, invitee: SiteUser): void {
		let host: SiteUser = this._waiting_room.get(invitee);
		invitee.is_waiting = false;
		if (host === undefined)
			inviteeSocket.emit('notification', "Something went wrong. Invitation is not valid");
		else {
			invitee.game_socket = inviteeSocket;
			invitee.sendAllTabsMessage('close-invitation', {});
			invitee.sendMessage('game-invite-accept', {});
			host.sendMessage('game-invite-accept', {});
			host.is_waiting = false;
			Logger.write(invitee.nickname + " has accepted " + host.nickname + "'s invite")
			this._waiting_room.delete(invitee);
			this.createRoom(host, invitee);
		}
	}

	/* Declines waiting game */
	public declineWaitingGame(inviteeSocket: Socket, invitee: SiteUser): void {
		let host: SiteUser = this._waiting_room.get(invitee);
		invitee.is_waiting = false;
		if (host === undefined)
			inviteeSocket.emit('notification', "Something went wrong. Invitation is not valid");
		else {
			invitee.sendAllTabsMessage('close-invitation', {});
			host.sendAllTabsMessage('game-invite-status', {status: "annulled"});
			host.sendMessage('notification', {message: invitee.nickname + " has declined your invitation"});
			host.is_waiting = false;
			Logger.write(invitee.nickname + " has declined " + host.nickname + "'s invite")
			this._waiting_room.delete(invitee);
		}
	}

	private areAbleToPlay(invitee: SiteUser, host: SiteUser, hostSocket: Socket): boolean {
		if (invitee.is_playing || invitee.is_waiting || invitee.is_searching || host.is_playing || host.is_waiting || host.is_searching) {
			if (invitee.is_playing || host.is_playing)
				hostSocket.emit('notification', {message: ((invitee.is_playing ?
														invitee.nickname + " is" : "You are") + " already playing")});
			else if (invitee.is_searching || host.is_searching)
				hostSocket.emit('notification', {message: (invitee.is_searching ?
														invitee.nickname + " is" : "You are") + " already searching a game"});
			else if (invitee.is_waiting || host.is_waiting)
				hostSocket.emit('notification', {message: (invitee.is_waiting ?
														invitee.nickname + " is" : "You are") + " already waiting someone to play"});
			return false;
		}
		return true;
	}

	private async write_result_in_db(game: GameRoom) {
		this.matchService.createMatch({
			winnerLogin: game.winner().login,
			loserLogin: game.loser().login,
			winnerScore: game.winner().score,
			loserScore: game.loser().score
		});
	}

	toJSON() {
		let games: Array<Game> = [];
		this._rooms.forEach((e) => games.push(e.game));
		return {
			games_online: this._rooms.size,
			players_in_queue: this._queue.size,
			games: games
		}
	}
}