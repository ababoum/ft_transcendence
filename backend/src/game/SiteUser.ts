import {Socket} from "socket.io";
import {PlayerData} from "./PlayerData";

export class SiteUser {
	private readonly	_login: string;
	private readonly	_nickname: string;
	private readonly	_is_logged: boolean;
	private _socket: Socket;
	private _is_playing: boolean;
	private _is_leaved: boolean;
	private _gameData: PlayerData;

	constructor(socket: Socket, profile: any) {
		this._is_playing = false;
		this._is_leaved = false;
		this._socket = socket;
		try {
			this._login = profile.login;
			this._nickname = profile.nickname;
			this._is_logged = true;
			this._gameData = new PlayerData();
		} catch (error) {
			this._is_logged = false;
		}
	}

	public resetData(): void {
		delete this._gameData;
		this._gameData = new PlayerData();
		this._is_playing = false;
		this._is_leaved = false;
	}

	get gameData(): PlayerData {
		return this._gameData;
	}

	public sendMessage(args: string, param: object): void {
		this._socket.emit(args, param);
	}

	get login(): string {
		return this._login;
	}

	get nickname(): string {
		return this._nickname;
	}

	get is_logged(): boolean {
		return this._is_logged;
	}

	get is_playing(): boolean {
		return this._is_playing;
	}

	set is_playing(value: boolean) {
		this._is_playing = value;
	}

	get connected(): boolean {
		return this._socket.connected;
	}

	get disconnected(): boolean {
		return this._socket.disconnected;
	}

	get socket_id(): string {
		return this._socket.id;
	}

	get is_leaved(): boolean {
		return this._is_leaved;
	}

	set is_leaved(value: boolean) {
		this._is_leaved = value;
	}
}