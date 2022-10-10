<script lang="ts">
    import Header from "./Header.svelte";
    import {link, pop} from "svelte-spa-router";
    import {onMount} from 'svelte';
    import PongGame from "../PongGame";

    let canvas;
    let pong = new PongGame("5678", 1);

    const UP_KEY : number = 38;
    const DOWN_KEY : number = 40;

    function keyHandler(e) {
        if(e.keyCode == UP_KEY || e.keyCode == DOWN_KEY) {
            pong.movePaddle(e.keyCode);
        }
    }

    onMount(() => {
        const context = canvas.getContext('2d');

        // x, y are position. w and h are width and height of the shape
        function drawRect(x, y, w, h): void {
            context.fillStyle = "#0095DD";
            context.fillRect(x, y, w, h);
        }

        // x, y are position, r is radius
        function drawCircle(x: number, y: number, r: number): void {
            context.fillStyle = "white";
            context.beginPath();
            // 0 is start of angle. Math.PI * 2 (360 degrees) is end of angle. false is direction (not important in this context
            context.arc(x, y, r, 0, Math.PI * 2, false);
            context.closePath();
            context.fill();
        }

        function drawText(text: string, x: number, y: number, color: string): void {
            context.fillStyle = color;
            context.font = "45px fantasy";
            context.fillText(text, x, y);
        }

        function draw() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawText("waiting for players", 100, 200, "white");
            try {
                $: drawText((pong.playersCount === undefined ? "0" : pong.playersCount) + " connected", 200, 300, "white");
            } catch (error) {}
            /*
            try {
                context.clearRect(0, 0, canvas.width, canvas.height);
                drawRect(pong.leftPlayerX, pong.leftPlayerY, pong.paddleWidth, pong.paddleHeight);
                drawRect(pong.rightPlayerX, pong.rightPlayerY, pong.paddleWidth, pong.paddleHeight);
            } catch (error) {
                //console.log(error);
            }
            */
        }
        //draw();
        setInterval(draw, 100);
    })


</script>

<Header/>

<svelte:window on:keydown={keyHandler} on:keyup={keyHandler} />
<canvas
        bind:this={canvas}
        width={pong._field_width}
        height={pong._field_height}
></canvas>
<button on:click={pong.connectToGame}>
    {pong.playersCount === undefined ? "0" : pong.playersCount}
</button>

<style>
    canvas { background: #1a1e21; }
</style>