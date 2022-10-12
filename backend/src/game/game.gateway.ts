import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {Game} from "./Game";
import {Player} from "./Player";
import {Queue} from "../utils/Queue";
import {GameServer} from "./GameServer";

@WebSocketGateway(5678, {cors : '*'} ) //cors = all can connect
//@WebSocketGateway() //cors = all can connect
export class GameGateway {
    @WebSocketServer()
    server: Server;
    queue: Queue<Socket> = new Queue<Socket>();
    gameServer: GameServer;


    handleConnection(client: Socket) {
        //console.log('Client connected: ', client.id);
    }

    handleDisconnect(client: Socket) {
        //console.log('Client disconnected: ', client.id);
    }

    @SubscribeMessage('get-data')
    sendGameData(@ConnectedSocket() client: Socket): void {
      //  this.server.emit('get-data', JSON.stringify(this.game));
    }

    @SubscribeMessage('move-down')
    moveDownPaddle(@MessageBody() playerId: string, @ConnectedSocket() client:Socket): void {
      //  this.game.move_down(1);
    }

    @SubscribeMessage('move-up')
    moveUpPaddle(@MessageBody() playerId: string, @ConnectedSocket() client:Socket): void {
     //   this.game.move_up(1);
    }

    @SubscribeMessage('find-game')
    findGame(@MessageBody() playerId: string, @ConnectedSocket() client:Socket): void {
        this.queue.enqueue(client);
        console.log("Queue size = ", this.queue.size());
        client.emit('find-game', { status: 'searching' });
        console.log('responde message is sent');
        if (this.queue.size() == 2) {
            console.log("2 players are detected");
            this.gameServer = new GameServer(new Player(this.queue.dequeue()), new Player(this.queue.dequeue()));
        }
    }


}