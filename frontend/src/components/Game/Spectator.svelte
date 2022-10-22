<script lang="ts">
	import {onDestroy, onMount} from 'svelte';
	import {game_socket} from "../../stores/store";
	import Draw2D from "../../Draw2D";

	let canvas: any;
	let context: any;
	let paddle_color:string = "#FFFFFF";
	let ball_color: string = "#0000FF";
	let text_color: string = "#FFFF00";
	let match_finished: boolean = false;
	let data: any = {
		field: {
			width: 0,
			height: 0
		}
	};

	function draw() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		try {
			let draw: Draw2D = new Draw2D(context);
			let scaling: number = 1;
			if (!match_finished) {
				context.clearRect(0, 0, canvas.width, canvas.height);
				draw.rect(data.leftPlayer.x, data.leftPlayer.y, data.paddle.width, data.paddle.height, scaling, paddle_color);
				draw.rect(data.rightPlayer.x, data.rightPlayer.y, data.paddle.width, data.paddle.height, scaling, paddle_color);
				draw.circle(data.ball.x, data.ball.y, data.ball.radius, scaling, ball_color);
				draw.text(data.leftPlayer.score, data.leftPlayer.score_x, data.leftPlayer.score_y, scaling, text_color);
				draw.text(data.rightPlayer.score, data.rightPlayer.score_x, data.rightPlayer.score_y, scaling, text_color);
			} else {
				draw.text(data.winner, 10, 100, scaling, "red");
				draw.text("winner", 10, 200, scaling, "red");
			}
		} catch (error) {
			console.log(error);
		}
	}

	onMount(() => {
		context = canvas.getContext('2d');
		$game_socket.on('exit-game', (game_data) => {
			data = game_data;
			match_finished = true;
			draw();
		});
		$game_socket.on('get-data', (game_data) => {
			data = game_data;
			draw();
		});
	})

	onDestroy(() => {
		try {
			$game_socket.emit('exit-game');
			$game_socket.removeListener('get-data');
			$game_socket.removeListener('exit-game');
		} catch (error) {
		}
	});
</script>

{#if data.field.width !== 0}
    <div class="h-100 d-flex align-items-center justify-content-center">
        <ul class="list-group list-group-horizontal position-relative">
            <li class="list-group-item">{data.leftPlayer.nickname}</li>
            <li class="list-group-item">{data.rightPlayer.nickname}</li>
        </ul>
    </div>
{/if}

<div class="h-100 d-flex align-items-center justify-content-center">
    <canvas
            bind:this={canvas}
            width={data.field.width}
            height={ data.field.height}
    ></canvas>
</div>

<style>
    canvas {
        background: #1a1e21;
    }
</style>