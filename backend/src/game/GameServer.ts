import {Player} from "./Player";
import {Game} from "./Game";
import {Socket} from "socket.io";

export class GameServer {
    private readonly _games: Array<Game>;
	private interval;
	private static readonly fps = 50;


    constructor() {
        this._games = new Array<Game>();
        //if 2 are ready
    }

    public createRoom(player1: Player, player2: Player) {
        player1.socket.emit('find-game', { status: 'found' });
        player2.socket.emit('find-game', { status: 'found' });

        this._games.push(new Game(player1, player2));
		if (this._games.length == 1) {
			console.log("Game has been started");
			this.interval = setInterval(this.sendGameData, 1000 / GameServer.fps, this._games);
		}
    }

    public sendGameData(games: Array<Game>): void {
        games.forEach((element, index, object) => {
			element.update();
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
				if (object.length == 0) {
					clearInterval(this.interval);
					console.log("Interval is off, this game is over, games online " + object.length);
				}
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
}