import {Socket} from "socket.io";

export class Player {

    private				_x: number;
    private				_y: number;
    private				_score: number;
    private readonly	_id: number;
	private readonly _nickname: string;
    private readonly	_socket: Socket;

    constructor(player_socket: Socket, profile: any) {
        this._score = 0;
        this._socket = player_socket;
		this._id = profile._id;
		this._nickname = profile._nickname;
    }

	public move_down(maxTopPos: number): void {
		if (this.y + 7 <= maxTopPos)
			this.y += 7;
	}

	public move_up(maxBotPos: number): void {
		if (this.y - 7 >= maxBotPos)
			this.y -= 7;
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
}