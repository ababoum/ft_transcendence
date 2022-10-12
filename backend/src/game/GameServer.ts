import {Player} from "./Player";

export class GameServer {
    private leftPlayer: Player;
    private rightPlayer: Player;


    constructor(leftPlayer: Player, rightPlayer: Player) {
        this.leftPlayer = leftPlayer;
        this.rightPlayer = rightPlayer;

        this.leftPlayer.socket.emit('find-game', { status: 'found' });
        this.rightPlayer.socket.emit('find-game', { status: 'found' });
    }

    private writeResult() {}
}