import {Game} from "./Game";
import {SiteUser} from "./SiteUser";
import {Logger} from "./global.service";
import {Socket} from "socket.io";

export class GameRoom {
	private _game: Game;
	private _player1: SiteUser;
	private _player2: SiteUser;
	private _spectators: Map<Socket, String>;

	constructor(player1: SiteUser, player2: SiteUser) {
		this._player1 = player1;
		this._player2 = player2;
		this._player1.resetData();
		this._player2.resetData();
		this._game = new Game(player1, player2);
		this._spectators = new Map<Socket, String>();
		this.sendMessage('find-game', {status: 'found'});
		Logger.write("Game has been started. " + player1.nickname + " vs " + player2.nickname);
	}

	public sendMessage(args: string, param): void {
		this._player1.sendMessage(args, param);
		this._player2.sendMessage(args, param);
	}

	public update(): void {
		if (this._player1.is_ready && this._player2.is_ready) {
			this._game.update();
		}
		this.sendData();
	}

	public sendData(): void {
		this.sendMessage('get-data', this._game);

		this._spectators.forEach((value, key) => {
			if (key.connected)
				key.emit('get-data', this._game);
			else {
				Logger.write(value + " had stopped watching " +
					this._player1.nickname + " vs " + this._player2.nickname);
				this._spectators.delete(key);
			}
		});
	}

	public addSpectator(user: SiteUser, client: Socket) {
		this._spectators.set(client, (user.is_logged ? user.nickname : user.id));
		Logger.write((user.is_logged ? user.nickname : user.id) + " is spectating " + this._player1.nickname +
			+ " vs " + this._player2.nickname);
	}

	public check_nickname(nickname: string): boolean {
		return this._player1.nickname == nickname || this._player2.nickname == nickname;
	}

	public has(user: SiteUser): boolean {
		return this._player1 == user || this._player2 == user;
	}

	public movePaddle(siteUser: SiteUser, direction: string): void {
		this._game.movePaddle(siteUser, direction);
	}

	public isFinished(): boolean {
		return this._game.isFinished();
	}

	public endGame(): void {
		this.sendMessage('exit-game', this._game);
		this.sendMessage('game-invite-status', {status: "annulled"});
		this._spectators.forEach((value, key) => {
			if (key.connected)
				key.emit('exit-game', this._game);
			else
				this._spectators.delete(key);
		});
		Logger.write("Game " + this._player1.nickname + "(" + this._player1.score + ") vs "
			+ this._player2.nickname + "(" + this._player2.score + ") is finished.");
		this._player1.resetData();
		this._player2.resetData();
	}

	public winner(): SiteUser {
		return this._player1.score > this._player2.score ? this._player1 : this._player2;
	}

	public loser(): SiteUser {
		return this._player1.score < this._player2.score ? this._player1 : this._player2;
	}

	get game(): Game {
		return this._game;
	}

	get player1(): SiteUser {
		return this._player1;
	}

	get player2(): SiteUser {
		return this._player2;
	}
}