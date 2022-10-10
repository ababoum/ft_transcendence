import {io} from "socket.io-client";
import User from "./User";

export default class PongGame {

    private readonly _port: string;
    private readonly _id: number;
    private _socket;
    private _game_data;
    private _field_width: number = 600;
    private _field_height: number = 400;
    private _leftPlayerX: number;
    private _leftPlayerY: number;
    private _rightPlayerX: number;
    private _rightPlayerY: number;
    private _paddleHeight: number;
    private _paddleWidth: number;
    private _playersCount: number;

    constructor(port: string, id: number) {
        this._port = port;
        this._id = id;
        this._socket = io("http://localhost:" + this._port);

        this._socket.on('get-data', (data) => {
            this._game_data =  JSON.parse(data);
            this._field_height = this._game_data.FIELD_HEIGHT;
            this._field_width = this._game_data.FIELD_WIDTH;
            this._leftPlayerX = this._game_data.leftPlayer.x;
            this._leftPlayerY = this._game_data.leftPlayer.y;
            this._rightPlayerX = this._game_data.rightPlayer.x;
            this._rightPlayerY = this._game_data.rightPlayer.y;
            this._paddleHeight = this._game_data.paddleHeight;
            this._paddleWidth = this._game_data.paddleWidth;
            this._playersCount = this._game_data.playersCount;
            console.log(this);
        });
            /*

        });

             */

        /*
        setInterval (
            this.sendMessage.bind(this),
            33
        )
         */
    }

    public connectToGame = (event: any) => {
        console.log("Connect to game is pressed");
        this._socket.emit('find-game', this._id);

    }

    public movePaddle(move: number): void {
        this._socket.emit(move == 38 ? 'move-up' : 'move-down');
    }

    public sendMessage(): void {
       this._socket.emit('get-data', '');
    }

    public getData(): void {
        this._socket.emit('get-data');
    }

    public findGame(id: number): void {
        this._socket.emit('find-game', id);
    }


    get field_width(): number {
        return this._field_width;
    }

    get field_height(): number {
        return this._field_height;
    }


    get leftPlayerX(): number {
        return this._leftPlayerX;
    }

    get leftPlayerY(): number {
        return this._leftPlayerY;
    }

    get paddleHeight(): number {
        return this._paddleHeight;
    }

    get rightPlayerX(): number {
        return this._rightPlayerX;
    }

    get rightPlayerY(): number {
        return this._rightPlayerY;
    }

    get paddleWidth(): number {
        return this._paddleWidth;
    }


    get playersCount(): number {
        return this._playersCount;
    }
}