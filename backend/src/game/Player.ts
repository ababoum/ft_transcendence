import {Socket} from "socket.io";

export class Player {

    private _x: number;
    private _y: number;
    private _score: number;
    private _socket: Socket;

    constructor(player_socket: Socket) {
        this._score = 0;
        this._socket = player_socket;
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
}