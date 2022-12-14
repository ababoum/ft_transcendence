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

	/* Send same message to players */
	public sendMessage(args: string, param): void {
		this._player1.sendMessage(args, param);
		this._player2.sendMessage(args, param);
	}

	/* Will update element positions if players are ready to play and send elements positions to them */
	public update(): void {
		if (this._player1.is_ready && this._player2.is_ready) {
			this._game.update();
		}
		this.sendData();
	}

	/*	Send element's positions to players and spectators and will delete disconnected */
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

	/*	Add spectator to spectator list */
	public addSpectator(spectatorUser: SiteUser, spectatorSocket: Socket): void {
		this._spectators.set(spectatorSocket, (spectatorUser.is_logged ? spectatorUser.nickname : spectatorUser.id));
		Logger.write((spectatorUser.is_logged ? spectatorUser.nickname : spectatorUser.id) + " is spectating " + this._player1.nickname +
			+" vs " + this._player2.nickname);
	}

	public deleteSpectator(spectatorSocket: Socket): boolean {
		return this._spectators.delete(spectatorSocket);
	}

	/* Check players nickname inside room */
	public check_nickname(nickname: string): boolean {
		return this._player1.nickname == nickname || this._player2.nickname == nickname;
	}

	/*	Check user inside room */
	public has(user: SiteUser): boolean {
		return this._player1 == user || this._player2 == user;
	}

	/* Move paddle */
	public movePaddle(siteUser: SiteUser, direction: string): void {
		this._game.setPaddleMovement(siteUser, direction);
	}

	/*	Game status */
	public isFinished(): boolean {
		return this._game.isFinished();
	}

	/* Ends game, send messages to clients with result and reset data to default values for next game */
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

	/* returns who are currently winning */
	public winner(): SiteUser {
		return this._player1.score > this._player2.score ? this._player1 : this._player2;
	}

	/* returns who are currently losing */
	public loser(): SiteUser {
		return this._player1.score < this._player2.score ? this._player1 : this._player2;
	}

	/* GETTERS */
	get game(): Game {
		return this._game;
	}

	get player1(): SiteUser {
		return this._player1;
	}

	get player2(): SiteUser {
		return this._player2;
	}

	get scoreWasChanged(): boolean {
		return this._game.scoreWasChanged;
	}

	/* SETTERS */

	set scoreWasChanged(value: boolean) {
		this._game.scoreWasChanged = value;
	}
}