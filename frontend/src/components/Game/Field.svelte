<script lang="ts">
    import Draw2D from "../../Draw2D";
	import {onMount} from "svelte";

	export let leftPlayer: object;
	export let rightPlayer: object;
	export let paddle: object;
	export let ball: object;
	export let field: object;
	export let paddle_color: string;
	export let ball_color: string;
	export let text_color: string;
	export let custom_interface: boolean = false;

	let canvas: any;
	let context: any;
	let scaling: number;

	let innerWidth, innerHeight: number;

	onMount(() => context = canvas.getContext('2d'));

	function getScalingNumber() {
		if (innerWidth < 0 || innerHeight < 0)
			return 1;
		let h: number = innerHeight / 100 * 60;
		let w: number = innerWidth / 100 * 60;
		if (h < field.height || w < field.width)
			return 1;
		if (h < w)
			return (h / field.height);
		return (w / field.height);
	}

    export const draw = () => {
		context.clearRect(0, 0, canvas.width, canvas.height);
		scaling = getScalingNumber();
		let draw: Draw2D = new Draw2D(context);
		if (custom_interface) {
			context.drawImage(document.getElementById("grass"), 0, 0, canvas.width, canvas.height);
			paddle_color = "black";
		}
		draw.rect(leftPlayer.x, leftPlayer.y, paddle.width, paddle.height, scaling, paddle_color);
		draw.rect(rightPlayer.x, rightPlayer.y, paddle.width, paddle.height, scaling, paddle_color);
		if (!custom_interface)
		    draw.circle(ball.x, ball.y, ball.radius, scaling, ball_color);
		else
		    draw.image(document.getElementById("ball"), ball.x - ball.radius - 7.5, ball.y - ball.radius - 7.5, 0, 0, ball.radius + 15, scaling);
		draw.text(leftPlayer.score, leftPlayer.score_x, leftPlayer.score_y, scaling, text_color);
		draw.text(rightPlayer.score, rightPlayer.score_x, rightPlayer.score_y, scaling, text_color);
	}

	export const draw_lost = () => {
		context.clearRect(0, 0, canvas.width, canvas.height);
		scaling = getScalingNumber();
		let draw: Draw2D = new Draw2D(context);
		draw.text("You lost", ((field.width / 2) - 2 * draw.text_size), field.height / 2, scaling, text_color);
    }

	export const draw_win = () => {
		context.clearRect(0, 0, canvas.width, canvas.height);
		scaling = getScalingNumber();
		let draw: Draw2D = new Draw2D(context);
		draw.text("You won", ((field.width / 2) - 2 * draw.text_size), field.height / 2, scaling, text_color);
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight/>

<div style="display:none;">
    <img alt="ball" id="ball" src="static/canva_ball.png"/>
    <img alt="grass" id="grass" src="static/grass.jpeg"/>
</div>

<div class="h-100 d-flex align-items-center justify-content-center">
    <canvas
            bind:this={canvas}
            width={field.width * scaling}
            height={field.height * scaling}
    ></canvas>
</div>

<style>
    canvas {
        background: #1a1e21;
    }
</style>