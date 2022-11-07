import {Socket} from "socket.io";
import {PlayerData} from "./PlayerData";
import {Game} from "./Game";

export class SiteUser {
	private readonly	_login: string;
	private readonly	_nickname: string;
	private readonly	_is_logged: boolean;
	private _game_socket: Socket;
	private _all_sockets: Set<Socket>;
	private _is_playing: boolean;
	private _is_leaved: boolean;
	private _is_waiting: boolean;
	private _is_searching: boolean;
	private _is_ready: boolean;
	private _gameData: PlayerData;

	constructor(socket: Socket, profile: any) {
		this._is_playing = false;
		this._is_leaved = false;
		this._is_searching = false;
		this._is_waiting = false;
		this._is_ready = false;
		this._all_sockets = new Set<Socket>();
		this._all_sockets.add(socket);
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
		this._is_waiting = false;
		this._is_searching = false;
		this._is_ready = false;

	}

	public sendMessage(args: string, param: object): void {
		this._game_socket.emit(args, param);
	}

	public sendAllTabsMessage(args: string, param: object): void {
		this._all_sockets.forEach((e) => {
			e.emit(args, param);
		});
	}

	public sendAllExcept(client: Socket, args: string, param: object): void {
		this._all_sockets.forEach((e) => {
			e.emit(args, param);
		});
	}

	get id(): string {
		return this._game_socket.id;
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
		return this._game_socket.connected;
	}

	get disconnected(): boolean {
		return this._game_socket.disconnected;
	}

	get is_leaved(): boolean {
		return this._is_leaved;
	}

	public add_socket(client: Socket): void {
		this._all_sockets.add(client);
	}

	public have(client: Socket): boolean {
		let result: boolean = false;
		this._all_sockets.forEach((v) => {
			if (client == v) {
				result = true;
				return ;
			}
		});
		return result;
	}

	public delete_socket(client: Socket): void {
		try {
			this._all_sockets.delete(client);
		} catch (e) {}
	}

	public connections_count(): number {
		return this._all_sockets.size;
	}

	set is_leaved(value: boolean) {
		this._is_leaved = value;
	}


	get is_waiting(): boolean {
		return this._is_waiting;
	}

	set is_waiting(value: boolean) {
		this._is_waiting = value;
	}

	set game_socket(value: Socket) {
		this._game_socket = value;
	}


	get is_searching(): boolean {
		return this._is_searching;
	}

	set is_searching(value: boolean) {
		this._is_searching = value;
	}

	get is_ready(): boolean {
		return this._is_ready;
	}

	set is_ready(value: boolean) {
		this._is_ready = value;
	}

	get score(): number {
		return this._gameData.score;
	}

	set score(score: number) {
		this._gameData.score = score;
	}

	get x(): number {
		return this._gameData.x;
	}

	set x(value: number) {
		this._gameData.x = value;
	}

	get y(): number {
		return this._gameData.y;
	}

	set y(value: number) {
		this._gameData.y = value;
	}

	public move_down(maxTopPos: number): void {
		this._gameData.move_down(maxTopPos);
	}

	public move_up(maxBotPos: number): void {
		this._gameData.move_up(maxBotPos);
	}

	public getPaddleTop(): number {
		return this._gameData.getPaddleTop();
	}

	public getPaddleBottom(): number {
		return this._gameData.getPaddleBottom();
	}

	public getPaddleLeft(): number {
		return this._gameData.getPaddleLeft();
	}

	public getPaddleRight(): number {
		return this._gameData.getPaddleRight();
	}
}