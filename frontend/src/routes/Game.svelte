<script lang="ts">
	import Header from "../components/Nav.svelte";
	import {push} from "svelte-spa-router";
	import {onDestroy, onMount} from 'svelte';
	import {game_socket, is_spectator} from "../stores";
	import {is_authenticated} from "../auth";
	import Draw2D from '../Draw2D'

	const UP_KEY: number = 38;
	const DOWN_KEY: number = 40;

	let canvas: any;
	let context: any;
	let is_ready: boolean = false;
	let paddle_color:string = "#FFFFFF";
	let ball_color: string = "#0000FF";
	let text_color: string = "#FFFF00";
	let match_finished: boolean = false;
	let innerWidth = 0;
	let innerHeight = 0;
	let data: any = {
		field: {
			width: 0,
			height: 0
		}
	};

	onMount(async () => { if (!await is_authenticated() && !$is_spectator) await push('/')} );

	function getScalingNumber() {
		if (innerWidth < innerHeight) {
			if (innerWidth - 150 > data.field.width)
				return (innerWidth - 150) / data.field.width;
			return 1;
        }
		if (innerHeight - 200 > data.field.height)
			return (innerHeight - 200) / data.field.height;
		return 1;
    }

	function keyHandler(e) {
		if (e.keyCode == DOWN_KEY) {
			$game_socket.emit('move-paddle', "down");
			$game_socket.emit('move-paddle', "down");
		}
		if (e.keyCode == UP_KEY) {
			$game_socket.emit('move-paddle', "up");
			$game_socket.emit('move-paddle', "up");
		}
	}

	function draw() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		try {
			let scaling = getScalingNumber();
			let draw: Draw2D = new Draw2D(context);
			if (!match_finished) {
				context.clearRect(0, 0, canvas.width * scaling, canvas.height * scaling);
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
		$is_spectator = false;
		try {
			$game_socket.emit('exit-game');
			$game_socket.removeListener('get-data');
			$game_socket.removeListener('exit-game');
		} catch (error) {
		}
	});
</script>

<Header/>
<div class="h-100 d-flex align-items-center justify-content-center">
    <input style="height: 50px" type="color" bind:value={paddle_color}>
    <input style="height: 50px" type="color" bind:value={ball_color}>
    <input style="height: 50px" type="color" bind:value={text_color}>
    <br>
</div>

<svelte:window on:keydown|preventDefault={keyHandler} bind:innerWidth bind:innerHeight/>
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
            width={data.field.width * getScalingNumber()}
            height={ data.field.height * getScalingNumber()}
    ></canvas>
</div>

{#if !is_ready && data.field.width !== 0 && !$is_spectator}
    <div class="h-100 d-flex align-items-center justify-content-center">
       <br>
        <button on:click={() => {$game_socket.emit('ready'); is_ready = true}} >Ready</button>
    </div>
{:else}
    <br>
{/if}


<style>
    canvas {
        background: #1a1e21;
    }
</style>