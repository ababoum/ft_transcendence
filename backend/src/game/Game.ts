import {Player} from "./Player";
import {Socket} from "socket.io";

export class Game {
	/*** CONSTANTS ***/
	readonly FIELD_HEIGHT: number = 400;
    readonly FIELD_WIDTH: number = 600;
    readonly PADDLE_HEIGHT: number = 100;
    readonly PADDLE_WIDTH: number = 10;
    public static readonly MAX_SCORE: number = 42;

	/*** VARS ***/
	private _leftPlayer: Player;
    private _rightPlayer: Player;
	private ball = new class {
		public x: number;
		public y: number;
		readonly radius: number = 10;
	};



    constructor(player1: Player, player2: Player) {
        this._leftPlayer = player1;
        this._rightPlayer = player2;

		this._leftPlayer.x = 0;
		this._leftPlayer.y = this.FIELD_HEIGHT / 2 - this.PADDLE_HEIGHT / 2;
		this._rightPlayer.x = this.FIELD_WIDTH - this.PADDLE_WIDTH;
		this._rightPlayer.y = this.FIELD_HEIGHT / 2 - this.PADDLE_HEIGHT / 2;
		this.ball.x = this.FIELD_WIDTH / 2;
		this.ball.y = this.FIELD_HEIGHT / 2;

		//setInterval(() => {this.FIELD_HEIGHT -= 5}, 1000);
		//this.startGame();
    }

	public startGame(): void {
		console.log("Game has been started");
		console.log("Game over");
	}

	private initialize(): void {

	}

    public movePaddle(socket: Socket, direction: string): boolean {
        if (this._leftPlayer.socket == socket) {
            direction == "up" ?
                this._leftPlayer.move_up(0) :
                this._leftPlayer.move_down(this.FIELD_HEIGHT - this.PADDLE_HEIGHT);
            return true;
        } else if (this._rightPlayer.socket == socket) {
            direction == "up" ?
                this._rightPlayer.move_up(0) :
                this._rightPlayer.move_down(this.FIELD_HEIGHT - this.PADDLE_HEIGHT);
            return true;
        }
        return false;
    }

    public endGameByLeaverSocket(socket: Socket): boolean {
        if (socket == this._leftPlayer.socket) {
			if (this._leftPlayer.score != Game.MAX_SCORE)
				this._rightPlayer.score = Game.MAX_SCORE;
			console.log("leaver has been deleted from the game");
			return true;
		} else if (socket == this._rightPlayer.socket) {
			if (this._rightPlayer.score != Game.MAX_SCORE)
				this._leftPlayer.score = Game.MAX_SCORE;
			console.log("leaver has been deleted from the game");
			return true;
		}
		return false;
	}


	get leftPlayer(): Player {
		return this._leftPlayer;
	}

	get rightPlayer(): Player {
		return this._rightPlayer;
	}

	toJSON() {
		return {
			leftPlayer: {
				x: this._leftPlayer.x,
				y: this._leftPlayer.y,
				score: this._leftPlayer.score,
				nickname: this._leftPlayer.nickname,
			},
			rightPlayer: {
				x: this._rightPlayer.x,
				y: this._rightPlayer.y,
				score: this._rightPlayer.score,
				nickname: this._rightPlayer.nickname,
			},
			field: {
				height: this.FIELD_HEIGHT,
				width: this.FIELD_WIDTH
			},
			paddle: {
				height: this.PADDLE_HEIGHT,
				width: this.PADDLE_WIDTH
			},
			ball: {
				x: this.ball.x,
				y: this.ball.y,
				radius: this.ball.radius
			}
		}
	}




}