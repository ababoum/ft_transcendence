import {PlayerData} from "./PlayerData";
import {Game} from "./Game";
import {Socket} from "socket.io";
import {SiteUser} from "./SiteUser";

export class GameServer {
	private _games: Array<Game>;
	private _queue: Set<SiteUser>;
	private _spectators: Map<Game, Set<SiteUser>>;
	private _waiting_room: Map<String, SiteUser>;

	private static readonly fps = 100;
	private _interval;

	constructor() {
		this._games = new Array<Game>();
		this._waiting_room = new Map();
		this._queue = new Set();
		this._spectators = new Map();
	}

	private createRoom(player1: SiteUser, player2: SiteUser) {
		player1.sendMessage('find-game', {status: 'found'});
		player2.sendMessage('find-game', {status: 'found'});
		this._games.push(new Game(player1, player2));

		let game: Game = this._games[this._games.length - 1];
		this.sendData(game);
		console.log("Game has been started");
		if (this._interval == undefined)
			this._interval = setInterval(() => {
				for (let i = 0; i < this._games.length; i++) {
					if (this._games[i].leftPlayer.gameData.is_ready && this._games[i].rightPlayer.gameData.is_ready)
						this._games[i].update();
					this.sendData(this._games[i]);
					if (this._games[i].isFinished()) {
						GameServer.write_result_in_db(this._games[i]);
						this.exitGame(this._games[i]);
						this._games.length = 0; //FIXME BUG WHEN 2+ game
						if (this._games.length == 0) {
							clearInterval(this._interval);
							this._interval = undefined;
							console.log("Interval is off, this game is over, games online " + this._games.length);
						}
					}
				}
			}, 1000 / GameServer.fps, this._games);
	}

	public addPlayerToQueue(siteUser: SiteUser): void {
		siteUser.is_leaved = false;
		if (!siteUser.is_logged || (this._queue.size == 1 && this._queue.values().next().value.login == siteUser.login) || siteUser.is_playing
			|| this.isInWaitingRoom(siteUser.login))
			return;
		this._queue.add(siteUser);
		siteUser.sendMessage('find-game', {status: 'searching'});
		console.log("Client " + siteUser.login + " is searching a game");
		console.log("Queue size is " + this._queue.size);
		if (this._queue.size == 2) {
			let iter = this._queue.keys();
			this.createRoom(iter.next().value, iter.next().value);
			this._queue.clear();
			console.log("Game has been started. Queue: " + this._queue.size + " players");
		}
	}

	addSpectator(siteUser: SiteUser, login: any) {
		console.log("spec ", login);
		this._games.forEach((element) => {
			if (element.leftPlayer.login == login || element.rightPlayer.login == login) {
				if (!this._spectators.has(element))
					this._spectators.set(element, new Set<SiteUser>());
				this._spectators.get(element).add(siteUser);
			}
		});
	}

	public deletePlayerFromQueue(siteUser: SiteUser) {
		console.log(siteUser.nickname + " has been deleted from queue");
		this._queue.delete(siteUser);
	}

	public movePaddle(siteUser: SiteUser, direction: string): void {
		this._games.forEach(element => {
			if (element.movePaddle(siteUser, direction))
				return;
		});
	}

	private sendData(game: Game): void {
		game.leftPlayer.sendMessage('get-data', game);
		game.rightPlayer.sendMessage('get-data', game);
		if (this._spectators.has(game)) {
			this._spectators.get(game).forEach((element) => {
				element.connected ? element.sendMessage('get-data', game) :
					this._spectators.get(game).delete(element);
			});
		}
	}

	private exitGame(game: Game): void {
		game.leftPlayer.sendMessage('exit-game', game);
		game.rightPlayer.sendMessage('exit-game', game);
		if (this._spectators.has(game)) {
			this._spectators.get(game).forEach((element) => {
				if (element.connected)
					element.sendMessage('exit-game', game);
				else
					this._spectators.get(game).delete(element);
			});
		}
		game.leftPlayer.resetData();
		game.rightPlayer.resetData();
	}

	public putUserInWaitingRoom(invited: string, siteUser: SiteUser): void {
		if (!this.isInWaitingRoom(invited) && !this.isInWaitingRoom(siteUser.login))
			this._waiting_room.set(invited, siteUser);
	}

	public acceptWaitingGame(siteUser: SiteUser): void {
		this._waiting_room.forEach((value, key, map) => {
			if (siteUser.login == key) {
				this.createRoom(siteUser, value);
				siteUser.sendMessage('game-invite-accept', {});
				value.sendMessage('game-invite-accept', {});
				map.delete(key);
				return;
			}
		});
	}

	public declineWaitingGame(siteUser: SiteUser): void {
		this._waiting_room.forEach((value, key, map) => {
			if (siteUser.login == key) {
				siteUser.sendMessage('game-invite-decline', {});
				value.sendMessage('game-invite-decline', {});
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

	private static async write_result_in_db(game: Game) {
		let url = "http://localhost:3000/match_history/create";
		let winner: SiteUser = game.leftPlayer.gameData.score == Game.MAX_SCORE ? game.leftPlayer : game.rightPlayer;
		let loser: SiteUser = game.leftPlayer == winner ? game.rightPlayer : game.leftPlayer;
		console.log(winner.gameData.score, " ", loser.gameData.score)
		const res = await fetch(url, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				winnerLogin: winner.login,
				loserLogin: loser.login,
				winnerScore: winner.gameData.score,
				loserScore: loser.gameData.score
			})
		});
	}

	toJSON() {
		return {
			games_online: this._games.length,
			players_in_queue: this._queue.size,
			games: this._games
		}
	}
}