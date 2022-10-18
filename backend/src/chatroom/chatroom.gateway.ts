import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Socket} from "socket.io";


@WebSocketGateway(5678, {cors: '*'})
export class ChatRoomGateway {
	@WebSocketServer()
	private server: any;
	// private _gameServer: GameServer;
	// private _interval;

	// constructor() {
	// 	this._gameServer = new GameServer();
	// 	this._interval = setInterval(() => {
	// 			this.server.emit('get-games-list', this._gameServer);
	// 	} , 3000);
	// }

	// handleConnection(client: Socket) {
	// 	// console.log("connect --- " + client.id);
	// 	this._gameServer._playersOnlineCount++;
	// }

	// handleDisconnect(client: Socket) {
	// 	// console.log("disc --- " + client.id);
	// 	this._gameServer._playersOnlineCount--;
	// 	this._gameServer.deletePlayerFromQueue(client);
	// }

	// @SubscribeMessage('exit-game')
	// exitGame(@ConnectedSocket() client: Socket): void {
	// 	this._gameServer.endLeaverGame(client);
	// }

	// @SubscribeMessage('get-games-list')
	// initGameList(@ConnectedSocket() client: Socket): void {
	// 	client.emit('get-games-list', this._gameServer);
	// }
}