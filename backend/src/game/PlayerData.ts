import {Game} from "./Game";

export class PlayerData {
    private				_x: number;
    private				_y: number;
	private 			_score: number;
	private _offset: number;

    constructor() {
        this._score = 0;
		this._offset = 0;
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

	public move_down(): void {
		if (this._offset < 0)
			this._offset = 0;
		if (this._offset + 30 <= 30)
			this._offset = 30;
		else
			this._offset = 30;
	}

	public move_up(): void {
		if (this._offset > 0)
			this._offset = 0;
		if (this._offset - 30 <= -30)
			this._offset = -30;
		else
			this._offset = -30;
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

	get offset(): number {
		return this._offset;
	}

	set offset(value: number) {
		this._offset = value;
	}
}