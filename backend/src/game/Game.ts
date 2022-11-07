import {SiteUser} from "./SiteUser";
import {Logger} from "./global.service";

export class Game {
	/*** CONSTANTS ***/
	public static readonly FIELD_HEIGHT: number = 400;
	public static readonly FIELD_WIDTH: number = 600;
	public static readonly PADDLE_HEIGHT: number = 100;
	public static readonly PADDLE_WIDTH: number = 10;
	public static readonly MAX_SCORE: number = 42;

	/*** VARS ***/
	private readonly _leftPlayer: SiteUser;
	private readonly _rightPlayer: SiteUser;

	private ball = new class {
		public x: number;
		public y: number;
		readonly radius: number = 10;
		public speed: number = 5;
		public velocityX: number = 5;
		public velocityY: number = 5;

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

		public reset(): void {
			this.x = Game.FIELD_WIDTH / 2;
			this.y = Game.FIELD_HEIGHT / 2;
			this.speed = 5;
			this.velocityX = -this.velocityX;
		}
	};

	constructor(player1: SiteUser, player2: SiteUser) {
		this._leftPlayer = player1;
		this._rightPlayer = player2;
		this.leftPlayer.is_playing = true;
		this.rightPlayer.is_playing = true;

		this._leftPlayer.x = 0;
		this._leftPlayer.y = Game.FIELD_HEIGHT / 2 - Game.PADDLE_HEIGHT / 2;
		this._rightPlayer.x = Game.FIELD_WIDTH - Game.PADDLE_WIDTH;
		this._rightPlayer.y = Game.FIELD_HEIGHT / 2 - Game.PADDLE_HEIGHT / 2;
		this.ball.x = Game.FIELD_WIDTH / 2;
		this.ball.y = Game.FIELD_HEIGHT / 2;
		this.ball.reset();
	}

	private collision(player: SiteUser): boolean {
		return (this.ball.getRight() > player.getPaddleLeft() && this.ball.getTop() < player.getPaddleBottom() &&
			this.ball.getLeft() < player.getPaddleRight() && this.ball.getBottom() > player.getPaddleTop());
	}

	public update(): void {
		//start
		this.ball.x += this.ball.velocityX;
		this.ball.y += this.ball.velocityY;
		if (this.ball.y + this.ball.radius > Game.FIELD_HEIGHT ||
			this.ball.y - this.ball.radius < 0) {
			this.ball.velocityY = -this.ball.velocityY;
		}
		//collision check
		let player: SiteUser = this.ball.x < Game.FIELD_WIDTH / 2 ? this._leftPlayer : this._rightPlayer;
		if (this.collision(player)) {
			//if collision, need check where exactly ball touched paddle to change ball direction
			let collidePoint = (this.ball.y - (player.y + Game.PADDLE_HEIGHT / 2));
			collidePoint = collidePoint / (Game.PADDLE_HEIGHT / 2);
			let angeRad = (Math.PI / 4) * collidePoint;
			let direction = (this.ball.x < Game.FIELD_WIDTH / 2) ? 1 : -1;
			this.ball.velocityX = direction * this.ball.speed * Math.cos(angeRad);
			this.ball.velocityY = direction * this.ball.speed * Math.sin(angeRad);

			this.ball.speed += 0.1;
		}
		if (this.ball.x - this.ball.radius < 0) {
			this.rightPlayer.score++;
			this.ball.reset();
		} else if (this.ball.x + this.ball.radius > Game.FIELD_WIDTH) {
			this.leftPlayer.score++;
			this.ball.reset();
		}
	}

	public movePaddle(siteUser: SiteUser, direction: string): void{
		if (this._leftPlayer.nickname == siteUser.nickname)
			direction == "up" ?
				this._leftPlayer.move_up(0) :
				this._leftPlayer.move_down(Game.FIELD_HEIGHT - Game.PADDLE_HEIGHT);
		else if (this._rightPlayer.nickname == siteUser.nickname)
			direction == "up" ?
				this._rightPlayer.move_up(0) :
				this._rightPlayer.move_down(Game.FIELD_HEIGHT - Game.PADDLE_HEIGHT);
	}

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

	get leftPlayer(): SiteUser {
		return this._leftPlayer;
	}

	get rightPlayer(): SiteUser {
		return this._rightPlayer;
	}

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