export class Game {
    static Player = class {
        public x: number;
        public y: number;
        public side: string;
        public score: number;
        public playerId: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
            this.score = 0;
        }
    }

    readonly FIELD_HEIGHT: number = 400;
    readonly FIELD_WIDTH: number = 600;
    readonly paddleHeight: number = 100;
    readonly paddleWidth: number = 10;

    private leftPlayer;
    private rightPlayer;
    private playersCount: number = 0;


    constructor() {
        this.leftPlayer = new Game.Player(0, this.FIELD_HEIGHT / 2 - this.paddleHeight / 2);
        this.rightPlayer = new Game.Player(this.FIELD_WIDTH - this.paddleWidth, this.FIELD_HEIGHT / 2 - this.paddleHeight / 2);
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