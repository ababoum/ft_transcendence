import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";

@WebSocketGateway(5678, {cors : '*'} ) //cors = all can connect
//@WebSocketGateway() //cors = all can connect
export class GameGateway {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log('Client connected: ', client.id);
    }

    handleDisconnection(client: Socket) {
        console.log('Client disconnected: ', client.id);
    }

    @SubscribeMessage('message')
    handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket): void {
        this.server.emit('message', client.id, data);
    }
}