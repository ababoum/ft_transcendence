import {SiteUser} from "./SiteUser";
import {Logger} from "./global.service";

export class Game {
	/*** CONSTANTS ***/
	public static readonly FIELD_HEIGHT: number = 200;
	public static readonly FIELD_WIDTH: number = 300;
	public static readonly PADDLE_HEIGHT: number = 50;
	public static readonly PADDLE_WIDTH: number = 5;
	public static readonly MAX_SCORE: number = 12;

	/*** VARS ***/
	private readonly _leftPlayer: SiteUser;
	private readonly _rightPlayer: SiteUser;
	private _scoreWasChanged: boolean;

	/*** Nested BALL class ***/
	private ball = new class {
		public x: number;
		public y: number;
		readonly radius: number;
		public speed: number;
		public velocityX: number;
		public velocityY: number;

		constructor() {
			this.radius = 5;
			this.speed = 2.5;
			this.velocityX = 2;
			this.velocityY = 2;
		}

		/* GETTERS */
		public getTop(): number {
			return this.y - this.radius;
		}

		public getBottom(): number {
			return this.y + this.radius;
		}

		public getLeft(): number {
			return this.x - this.radius;
		}

		public getRight(): number {
			return this.x + this.radius;
		}

		/* Reset ball position and speed */
		public reset(): void {
			this.x = Game.FIELD_WIDTH / 2;
			this.y = Game.FIELD_HEIGHT / 2;
			this.speed = 2.5;
			this.velocityX = -this.velocityX;
		}
	};

	constructor(player1: SiteUser, player2: SiteUser) {
		this._leftPlayer = player1;
		this._rightPlayer = player2;
		this.leftPlayer.is_playing = true;
		this.rightPlayer.is_playing = true;
		this.scoreWasChanged = false;

		this._leftPlayer.x = 0;
		this._leftPlayer.y = Game.FIELD_HEIGHT / 2 - Game.PADDLE_HEIGHT / 2;
		this._rightPlayer.x = Game.FIELD_WIDTH - Game.PADDLE_WIDTH;
		this._rightPlayer.y = Game.FIELD_HEIGHT / 2 - Game.PADDLE_HEIGHT / 2;
		this.ball.x = Game.FIELD_WIDTH / 2;
		this.ball.y = Game.FIELD_HEIGHT / 2;
	}

	/*	Check if ball touch an elements */
	private collision(player: SiteUser): boolean {
		return (this.ball.getRight() > player.getPaddleLeft() && this.ball.getTop() < player.getPaddleBottom() &&
			this.ball.getLeft() < player.getPaddleRight() && this.ball.getBottom() > player.getPaddleTop());
	}

	/*	Update element's positions */
	public update(): void {
		//start
		this.ball.x += this.ball.velocityX;
		this.ball.y += this.ball.velocityY;
		if (this.ball.y + this.ball.radius > Game.FIELD_HEIGHT ||
			this.ball.y - this.ball.radius < 0) {
			this.ball.velocityY = -this.ball.velocityY;
		}
		//collision check
		Game.move_paddle(this.leftPlayer);
		Game.move_paddle(this.rightPlayer);
		let player: SiteUser = this.ball.x < Game.FIELD_WIDTH / 2 ? this._leftPlayer : this._rightPlayer;
		if (this.collision(player)) {
			//if collision, need check where exactly ball touched paddle to change ball direction
			let collidePoint = (this.ball.y - (player.y + Game.PADDLE_HEIGHT / 2));
			collidePoint = collidePoint / (Game.PADDLE_HEIGHT / 2);
			let angleRad = (Math.PI / 4) * collidePoint;
			let direction = (this.ball.x + this.ball.radius < Game.FIELD_WIDTH / 2) ? 1 : -1;
			this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRad);
			this.ball.velocityY = this.ball.speed * Math.sin(angleRad);
			this.ball.speed += 0.1;
		}
		if (this.ball.x - this.ball.radius < 0) {
			this.rightPlayer.score++;
			this.scoreWasChanged = true;
			this.ball.reset();
		} else if (this.ball.x + this.ball.radius > Game.FIELD_WIDTH) {
			this.leftPlayer.score++;
			this.scoreWasChanged = true;
			this.ball.reset();
		}
	}

	private static move_paddle(player: SiteUser) {
		if (player.offset > 0) {
			if (player.y + 2.5 <= Game.FIELD_HEIGHT - this.PADDLE_HEIGHT) {
				player.y += 2.5;
				player.offset -= 2.5;
			} else {
				player.y = Game.FIELD_HEIGHT - this.PADDLE_HEIGHT;
				player.offset = 0;
			}
		} else if (player.offset < 0) {
			if (player.y - 2.5 >= 0) {
				player.y -= 2.5;
				player.offset += 2.5;
			} else {
				player.offset = 0;
				player.y = 0;
			}
		}
	}

	/* Interface for move paddle */
	public setPaddleMovement(siteUser: SiteUser, direction: string): void {
		if (this._leftPlayer.nickname == siteUser.nickname)
			direction == "up" ?
				this._leftPlayer.move_up() :
				this._leftPlayer.move_down();
		else if (this._rightPlayer.nickname == siteUser.nickname)
			direction == "up" ?
				this._rightPlayer.move_up() :
				this._rightPlayer.move_down();
	}

	/*	Check connections, leave status and score */
	public isFinished(): boolean {
		if (this.rightPlayer.disconnected || this.rightPlayer.is_leaved) {
			this.leftPlayer.score = Game.MAX_SCORE;
			Logger.write(this.rightPlayer.nickname + " has left game");
		} else if (this.leftPlayer.disconnected || this.leftPlayer.is_leaved) {
			this.rightPlayer.score = Game.MAX_SCORE;
			Logger.write(this.leftPlayer.nickname + " has left game");
		}
		return (this.leftPlayer.score == Game.MAX_SCORE || this._rightPlayer.score == Game.MAX_SCORE);
	}

	/* GETTERS */
	get leftPlayer(): SiteUser {
		return this._leftPlayer;
	}

	get rightPlayer(): SiteUser {
		return this._rightPlayer;
	}

	get scoreWasChanged(): boolean {
		return this._scoreWasChanged;
	}

	set scoreWasChanged(value: boolean) {
		this._scoreWasChanged = value;
	}

	/*	to JSON */
	public toJSON() {
		return {
			leftPlayer: {
				x: this._leftPlayer.x,
				y: this._leftPlayer.y,
				score: this._leftPlayer.score,
				nickname: this._leftPlayer.nickname,
				score_x: Game.FIELD_WIDTH / 4,
				score_y: Game.FIELD_HEIGHT / 5
			},
			rightPlayer: {
				x: this._rightPlayer.x,
				y: this._rightPlayer.y,
				score: this._rightPlayer.score,
				nickname: this._rightPlayer.nickname,
				score_x: 3 * Game.FIELD_WIDTH / 4,
				score_y: Game.FIELD_HEIGHT / 5
			},
			field: {
				height: Game.FIELD_HEIGHT,
				width: Game.FIELD_WIDTH
			},
			paddle: {
				height: Game.PADDLE_HEIGHT,
				width: Game.PADDLE_WIDTH
			},
			ball: {
				x: this.ball.x,
				y: this.ball.y,
				radius: this.ball.radius
			},
			winner: (this.leftPlayer.score == Game.MAX_SCORE ? this.leftPlayer.nickname : this.rightPlayer.nickname)
		}
	}
}