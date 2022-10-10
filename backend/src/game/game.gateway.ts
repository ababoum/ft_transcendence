import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {Game} from "./Game";

@WebSocketGateway(5678, {cors : '*'} ) //cors = all can connect
//@WebSocketGateway() //cors = all can connect
export class GameGateway {
    @WebSocketServer()
    server: Server;
    game: Game = new Game();

    handleConnection(client: Socket) {
        console.log('Client connected: ', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected: ', client.id);
    }

    @SubscribeMessage('get-data')
    sendGameData(@ConnectedSocket() client: Socket): void {
        this.server.emit('get-data', JSON.stringify(this.game));
    }

    @SubscribeMessage('move-down')
    moveDownPaddle(@MessageBody() playerId: string, @ConnectedSocket() client:Socket): void {
        this.game.move_down(1);
    }

    @SubscribeMessage('move-up')
    moveUpPaddle(@MessageBody() playerId: string, @ConnectedSocket() client:Socket): void {
        this.game.move_up(1);
    }

    @SubscribeMessage('find-game')
    findGame(@MessageBody() playerId: string, @ConnectedSocket() client:Socket): void {
        this.game.connect_player();
        this.server.emit('get-data', JSON.stringify(this.game));
    }


}