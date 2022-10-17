import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Socket} from "socket.io";
import {Player} from "./Player";
import {GameServer} from "./GameServer";

@WebSocketGateway(5678, {cors: '*'})
export class GameGateway {
	@WebSocketServer()
	private server: any;
	private _gameServer: GameServer;
	private _interval;

	constructor() {
		this._gameServer = new GameServer();
		this._interval = setInterval(() => {
				this.server.emit('get-games-list', this._gameServer);
		} , 3000);
	}

	handleConnection(client: Socket) {
		console.log("connect --- " + client.id);
		this._gameServer._playersOnlineCount++;
	}

	handleDisconnect(client: Socket) {
		console.log("disc --- " + client.id);
		this._gameServer._playersOnlineCount--;
		this._gameServer.deletePlayerFromQueue(client);
	}

	@SubscribeMessage('ready')
	ready(@ConnectedSocket() client: Socket): void {
		this._gameServer.pressReady(client);
	}

	@SubscribeMessage('exit-game')
	exitGame(@ConnectedSocket() client: Socket): void {
		this._gameServer.endLeaverGame(client);
	}

	@SubscribeMessage('get-games-list')
	initGameList(@ConnectedSocket() client: Socket): void {
		client.emit('get-games-list', this._gameServer);
	}

	@SubscribeMessage('move-paddle')
	movePaddle(@MessageBody() direction: string, @ConnectedSocket() client: Socket): void {
		this._gameServer.movePaddle(client, direction);
	}

	@SubscribeMessage('find-game')
	findGame(@MessageBody() profile: any, @ConnectedSocket() client: Socket): void {
		this._gameServer.addPlayerToQueue(client, profile);
	}

	@SubscribeMessage('spectate')
	spectateHandler(@MessageBody() id: any, @ConnectedSocket() client: Socket): void {
		this._gameServer.addSpectator(client, id);
	}
}