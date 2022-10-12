import {Player} from "./Player";

export class Game {
    readonly FIELD_HEIGHT: number = 400;
    readonly FIELD_WIDTH: number = 600;
    readonly paddleHeight: number = 100;
    readonly paddleWidth: number = 10;

    private leftPlayer;
    private rightPlayer;
    private playersCount: number = 0;


    constructor(player1: Player, player2: Player) {
    }

    public move_down(player): void {
        if (player.y + 3 <= this.FIELD_HEIGHT - this.paddleHeight)
            player.y += 3;
    }

    public move_up(player): void {
        if (player.y - 3 >= 0)
            player.y -= 3;
    }

    public connect_player() {
        this.playersCount++;
    }

    /*
    toJSON() {
        return {
            playersCount: this.playersCount,
        }
    } */
}