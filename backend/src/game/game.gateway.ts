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
    gameServer: GameServer = new GameServer();


    handleConnection(client: Socket) {
        console.log('Client connected: ', client.id);
    }

    handleDisconnect(client: Socket) {
		console.log('Client disconnected: -_-', client.id);
        if (this.queue.contains(client)) {
            this.queue.dequeue();
            console.log("client " + client.id + " has been removed from queue" +
            ", queue size is " + this.queue.size());
        } else
            this.gameServer.endLeaverGame(client);
    }

    @SubscribeMessage('move-paddle')
    movePaddle(@MessageBody() direction: string, @ConnectedSocket() client: Socket): void {
        this.gameServer.movePaddle(client, direction);
    }

    @SubscribeMessage('find-game')
    findGame(@MessageBody() profile: any, @ConnectedSocket() client:Socket): void {
        console.log("Client " + client.id + " (login: " + profile.login + ") now searching a game");
        if (!this.queue.contains(client)) {
            this.queue.enqueue(client);
            client.emit('find-game', {status: 'searching'});
            console.log("Queue size is " + this.queue.size());
        } else
            console.log("Can't add client to queue, bcs he is already there");
        if (this.queue.size() == 2)
            this.gameServer.createRoom(new Player(this.queue.dequeue(), profile), new Player(this.queue.dequeue(), profile));
    }


}