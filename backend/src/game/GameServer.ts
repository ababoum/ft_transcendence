import {Socket} from "socket.io";
import {SiteUser} from "./SiteUser";
import {GameRoom} from "./GameRoom";
import {Logger} from "./global.service";
import {Game} from "./Game";
import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {GameGateway} from "./game.gateway";
import {UserService} from "../user/user.service";

@Injectable()
export class GameServer {
	private _queue: Set<SiteUser>;
	private _rooms: Set<GameRoom>;
	private _waiting_room: Map<String, SiteUser>;
	private static readonly fps = 100;
	private _interval;

	constructor(@Inject(forwardRef(() => GameGateway)) private readonly gameGateway: GameGateway,
				private readonly userService: UserService) {
		this._rooms = new Set();
		this._waiting_room = new Map();
		this._queue = new Set();
	}

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
						GameServer.write_result_in_db(val);
						val.endGame();
						this.userService.updateStatus(val.player1.login, 'online');
						this.userService.updateStatus(val.player2.login, 'online');
						set.delete(key);
						this.gameGateway.updateServerInfo();
					}
				});
			}, 1000 / GameServer.fps, this._rooms);
	}

	public addPlayerToQueue(client: Socket, siteUser: SiteUser): void {
		siteUser.game_socket = client;
		siteUser.is_searching = true;
		if (this.isInWaitingRoom(siteUser.login))
			return;
		this._queue.add(siteUser);
		siteUser.sendMessage('find-game', {status: 'searching'});
		Logger.write("Client " + siteUser.nickname + " is searching a game\nQueue size is " + this._queue.size);
		if (this._queue.size == 2) {
			let iter = this._queue.keys();
			this.createRoom(iter.next().value, iter.next().value);
			this._queue.clear();
			Logger.write("Players in queue " + this._queue.size);
		}
		this.gameGateway.updateServerInfo();
	}

	addSpectator(siteUser: SiteUser, client: Socket, nickname: any) {
		this._rooms.forEach((element) => {
			if (element.check_nickname(nickname)) {
				element.addSpectator(siteUser, client);
				return ;
			}
		});
	}

	public deletePlayerFromQueue(siteUser: SiteUser) {
		if (this._queue.delete(siteUser)) {
			siteUser.resetData();
			Logger.write(siteUser.nickname + " has been deleted from queue\nQueue size is " + this._queue.size);
			this.gameGateway.updateServerInfo();
		}
	}

	public movePaddle(siteUser: SiteUser, direction: string): void {
		this._rooms.forEach(element => {
			if (element.has(siteUser)) {
				element.movePaddle(siteUser, direction);
				return;
			}
		});
	}

	public putUserInWaitingRoom(invited: string, client: Socket, siteUser: SiteUser): void {
		if (!this.isInWaitingRoom(invited) && !this.isInWaitingRoom(siteUser.nickname)) {
			this._waiting_room.set(invited, siteUser);
			siteUser.game_socket = client;
			Logger.write(siteUser.nickname + " has invited " + invited + " to play");
		}
	}

	public acceptWaitingGame(client: Socket, siteUser: SiteUser): void {
		this._waiting_room.forEach((value, key, map) => {
			if (siteUser.nickname == key) {
				siteUser.game_socket = client;
				siteUser.sendAllExcept(client, 'close-invitation', {});
				siteUser.sendMessage('game-invite-accept', {});
				value.sendMessage('game-invite-accept', {});
				Logger.write(siteUser.nickname + " has accepted " + value.nickname + "'s invite")
				this.createRoom(siteUser, value);
				map.delete(key);
				return;
			}
		});
	}

	public declineWaitingGame(client: Socket, siteUser: SiteUser): void {
		this._waiting_room.forEach((value, key, map) => {
			if (siteUser.nickname == key) {
				client.emit('game-invite-decline', {});
				siteUser.sendAllExcept(siteUser.game_socket, 'close-invitation', {});
				value.sendMessage('game-invite-decline', {});
				Logger.write(siteUser.nickname + " has declined " + value.nickname + "'s invite")
				map.delete(key);
				return;
			}
		});
	}

	private isInWaitingRoom(login: string): boolean {
		let res: boolean = false;
		this._waiting_room.forEach((value, key) => {
			if (key == login || value.login == login) {
				res = true;
				return;
			}
		});
		return res;
	}

	private static async write_result_in_db(game: GameRoom) {
		let url = "http://localhost:3000/match_history/create";
		await fetch(url, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				winnerLogin: game.winner().login,
				loserLogin: game.loser().login,
				winnerScore: game.winner().score,
				loserScore: game.loser().score
			})
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