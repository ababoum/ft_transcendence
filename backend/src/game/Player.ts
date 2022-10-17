import {Socket} from "socket.io";
import {Game} from "./Game";

export class Player {

    private				_x: number;
    private				_y: number;
    private				_score: number;
    readonly _id: number;
	private readonly	_nickname: string;
    private readonly	_socket: Socket;
	private _is_ready: boolean;

    constructor(player_socket: Socket, profile: any) {
        this._score = 0;
        this._socket = player_socket;
		this._id = profile.id;
		this._nickname = profile.nickname;
		this._is_ready = false;
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


    get socket(): Socket {
        return this._socket;
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
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


	get nickname(): string {
		return this._nickname;
	}


	get is_ready(): boolean {
		return this._is_ready;
	}

	set is_ready(value: boolean) {
		this._is_ready = value;
	}

	get id(): number {
		return this._id;
	}
}