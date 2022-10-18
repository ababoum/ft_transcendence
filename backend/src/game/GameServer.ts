import {Player} from "./Player";
import {Game} from "./Game";
import {Socket} from "socket.io";

export class GameServer {
	private _games: Array<Game>;
	private _queue: Map<Socket, Player>;
	private _ingame_players: Map<Socket, Player>;
	private _spectators: Map<Game, Set<Socket> >;

	private static readonly fps = 100;
	public _playersOnlineCount: number;
	private _interval;

	constructor() {
		this._games = new Array<Game>();
		this._queue = new Map();
		this._ingame_players = new Map();
		this._spectators = new Map();

		this._playersOnlineCount = 0;
	}

	private createRoom(player1: Player, player2: Player) {
		player1.socket.emit('find-game', {status: 'found'});
		player2.socket.emit('find-game', {status: 'found'});

		this._games.push(new Game(player1, player2));
		let game: Game = this._games[this._games.length - 1];
		game.leftPlayer.socket.emit('get-data', game);
		game.rightPlayer.socket.emit('get-data', game);
		console.log("Game has been started");
		this._interval = setInterval(() => {
				for (let i = 0; i < this._games.length; i++) {
					if (this._games[i].leftPlayer.is_ready && this._games[i].rightPlayer.is_ready)
						this._games[i].update();
					this._games[i].leftPlayer.socket.emit('get-data', this._games[i]);
					this._games[i].rightPlayer.socket.emit('get-data', this._games[i]);
					if (this._spectators.has(this._games[i])) {
						this._spectators.get(this._games[i]).forEach((element) => {
							if (element.connected)
								element.emit('get-data', this._games[i]);
							else
								this._spectators.get(this._games[i]).delete(element);
						});
					}
					if (this._games[i].isFinished()) {
						game.leftPlayer.socket.emit('exit-game', game);
						game.rightPlayer.socket.emit('exit-game', game);
						this._ingame_players.delete(game.leftPlayer.socket);
						this._ingame_players.delete(game.rightPlayer.socket);
						this.write_result_in_db(this._games.pop());
						this._games.slice(i, 1); //FIXME POSSIBLE BUG WHEN 2+ game
						if (this._games.length == 0) {
							clearInterval(this._interval);
							console.log("Interval is off, this game is over, games online " + this._games.length);
						}
					}
				}
			}, 1000 / GameServer.fps, this._games);
	}

	public addPlayerToQueue(socket: Socket, playerInfo: any): void {
		for (let value of this._ingame_players.values())
			if (value.id == playerInfo.id)
				return;
		if (this._queue.has(socket) || this._ingame_players.has(socket))
			return;
		this._queue.set(socket, new Player(socket, playerInfo));
		this._ingame_players.set(socket, new Player(socket, playerInfo));
		socket.emit('find-game', {status: 'searching'});
		console.log("Client " + socket.id + " (login: " + playerInfo.login + ") now searching a game");
		console.log("Queue size is " + this._queue.size);
		if (this._queue.size == 2) {
			let iter = this._queue.keys();
			this.createRoom(this._queue.get(iter.next().value), this._queue.get(iter.next().value));
			this._queue.clear();
			console.log("Game has been started. Queue: " + this._queue.size + " players");
		}
	}

	addSpectator(socket: Socket, match_id: any) {
		this._games.forEach((element) => {
			if (element.leftPlayer.id == match_id.id1 || element.leftPlayer == match_id.id2) {
				if (!this._spectators.has(element))
					this._spectators.set(element, new Set<Socket>());
				this._spectators.get(element).add(socket);
			}
		});
	}

	public deletePlayerFromQueue(socket: Socket) {
		this._queue.delete(socket);
		this._ingame_players.delete(socket);
	}


	public pressReady(socket: Socket): void {
		this._games.forEach(element => {
			if (element.pressReady(socket))
				return;
		});
	}

	public movePaddle(socket: Socket, direction: string): void {
		this._games.forEach(element => {
			if (element.movePaddle(socket, direction))
				return;
		});
	}

	public endLeaverGame(socket: Socket): void {
		this._games.forEach(element => {
			if (element.endGameByLeaverSocket(socket))
				return;
		});
	}

	private write_result_in_db(game: Game): void {
			let url = "http://localhost:3000/match_history/create";
			let winner: Player = game.leftPlayer.score == Game.MAX_SCORE ? game.leftPlayer : game.rightPlayer;
			let loser: Player = game.leftPlayer == winner ? game.rightPlayer : game.leftPlayer;
			fetch(url, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					winnerLogin: winner.login,
					loserLogin: loser.login,
					winnerScore: winner.score,
					loserScore: loser.score
				})
			});
	}

	toJSON() {
		return {
			games_online: this._games.length,
			players_online: this._playersOnlineCount,
			players_in_queue: this._queue.size,
			games: this._games
		}
	}
}