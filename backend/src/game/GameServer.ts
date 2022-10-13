import {Player} from "./Player";
import {Game} from "./Game";
import {Socket} from "socket.io";

export class GameServer {
    private _games: Array<Game>;


    constructor() {
        this._games = new Array<Game>();
        //if 2 are ready
    }

    public createRoom(player1: Player, player2: Player) {
        player1.socket.emit('find-game', { status: 'found' });
        player2.socket.emit('find-game', { status: 'found' });

        this._games.push(new Game(player1, player2));
    }

    public movePaddle(socket: Socket, direction: string): void {
        this._games.forEach(element => {
            if (element.movePaddle(socket, direction))
                return;
        });
    }

    public endLeaverGame(socket: Socket): void {
        this._games.forEach(element => {
            if (element.endGameByLeaverSocket(socket))
                return;
        });
    }

    private writeResult() {}
}