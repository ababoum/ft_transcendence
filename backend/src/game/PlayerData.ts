import {Game} from "./Game";

export class PlayerData {
    private				_x: number;
    private				_y: number;
	private 			_score: number;

    constructor() {
        this._score = 0;
    }

	public getPaddleTop(): number {
		return this.y;
	}

	public getPaddleBottom(): number {
		return this.y + Game.PADDLE_HEIGHT;
	}

	public getPaddleLeft(): number {
		return this.x;
	}

	public getPaddleRight(): number {
		return this.x + Game.PADDLE_WIDTH;
	}

	public move_down(maxTopPos: number): void {
		if (this.y + 3.5 <= maxTopPos)
			this.y += 3.5;
	}

	public move_up(maxBotPos: number): void {
		if (this.y - 3.5 >= maxBotPos)
			this.y -= 3.5;
	}

    get x(): number {
        return this._x;
    }

	get y(): number {
		return this._y;
	}

    set x(value: number) {
        this._x = value;
    }

    set y(value: number) {
        this._y = value;
    }

    get score(): number {
        return this._score;
    }

    set score(value: number) {
        this._score = value;
    }
}