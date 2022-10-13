import {Player} from "./Player";
import {Game} from "./Game";
import {Socket} from "socket.io";

export class GameServer {
    private _games: Array<Game>;
	private interval;


    constructor() {
        this._games = new Array<Game>();
        //if 2 are ready
    }

    public createRoom(player1: Player, player2: Player) {
        player1.socket.emit('find-game', { status: 'found' });
        player2.socket.emit('find-game', { status: 'found' });

        this._games.push(new Game(player1, player2));
		if (this._games.length == 1)
        	this.interval = setInterval(this.sendGameData, 10, this._games);
    }

    public sendGameData(games: Array<Game>): void {
        games.forEach((element, index, object) => {
			element.leftPlayer.socket.emit('get-data', element);
			element.rightPlayer.socket.emit('get-data', element);
			if (element.leftPlayer.score == Game.MAX_SCORE ||
				element.rightPlayer.score == Game.MAX_SCORE) {
				element.leftPlayer.socket.emit('exit-game');
				element.rightPlayer.socket.emit('exit-game');
				if (object.length == 1)
					object.pop();
				else
					object.slice(index, 1);
				if (object.length == 0)
					clearInterval(this.interval);
				console.log("after " + object.length);
			}
        });
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