import {Player} from "./Player";
import {Socket} from "socket.io";

export class Game {
    readonly FIELD_HEIGHT: number = 400;
    readonly FIELD_WIDTH: number = 600;
    readonly paddleHeight: number = 100;
    readonly paddleWidth: number = 10;
    readonly MAX_SCORE: number = 42;
    private leftPlayer;
    private rightPlayer;

    constructor(player1: Player, player2: Player) {
        this.leftPlayer = player1;
        this.rightPlayer = player2;
		//this.startGame();
    }

	public startGame(): void {
		console.log("Game has been started");
		console.log("Game over");
	}

    public movePaddle(socket: Socket, direction: string): boolean {
        if (this.leftPlayer.socket == socket) {
            direction == "up" ?
                this.leftPlayer.move_up(0) :
                this.leftPlayer.move_down(this.FIELD_HEIGHT - this.paddleHeight);
            return true;
        } else if (this.rightPlayer.socket == socket) {
            direction == "up" ?
                this.rightPlayer.move_up(0) :
                this.rightPlayer.move_down(this.FIELD_HEIGHT - this.paddleHeight);
            return true;
        }
        return false;
    }

    public endGameByLeaverSocket(socket: Socket): boolean {
        if (socket == this.leftPlayer._socket) {
			if (this.leftPlayer.score != this.MAX_SCORE)
				this.rightPlayer.score = this.MAX_SCORE;
			console.log("leaver has been deleted from the game");
			return true;
		} else if (socket == this.rightPlayer.socket) {
			if (this.rightPlayer.score != this.MAX_SCORE)
				this.leftPlayer.score = this.MAX_SCORE;
			console.log("leaver has been deleted from the game");
			return true;
		}
		return false;
	}
}