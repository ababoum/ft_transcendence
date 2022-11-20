<script lang="ts">
	import {getContext, onDestroy, onMount} from 'svelte';
	import {game_socket, user} from "../../stores/store";
	import Field from "./Field.svelte";
	import PlayersInfo from "./PlayersInfo.svelte";

	const UP_KEY: number = 38;
	const DOWN_KEY: number = 40;

	let field;
	let is_ready: boolean = false;
	let paddle_color: string = "#FFFFFF";
	let ball_color: string = "#0000FF";
	let text_color: string = "#FFFF00";
	let match_finished: boolean = false;
	let custom_interface: boolean = false;
	let innerWidth = 0;
	let innerHeight = 0;
	let data: object;

	onMount(async () => {
		$user = await $user.upd();
	});

	function keyHandler(e) {
		if (e.keyCode == DOWN_KEY) {
			$game_socket.emit('move-paddle', "down");
		}
		if (e.keyCode == UP_KEY) {
			$game_socket.emit('move-paddle', "up");
		}
	}

	function draw() {
		try {
			if (!match_finished)
				field.draw(innerHeight, innerHeight);
			else {
				if (data.winner === $user.nickname)
					field.draw_win();
				else
					field.draw_lost();
			}
		} catch (error) {
		}
	}

	onMount(() => {
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

<div class="container">
    <div class="h-100 d-flex align-items-center justify-content-center mb-3">
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
            <label class="btn btn-secondary active">
                <input type="radio" name="options" id="option1" autocomplete="off" bind:group={custom_interface}
                       value={false} checked> Normal
            </label>
            <label class="btn btn-secondary">
                <input type="radio" name="options" id="option2" autocomplete="off" bind:group={custom_interface}
                       value={true}> Football
            </label>
        </div>
    </div>
    {#if !custom_interface}
        <div class="h-100 d-flex align-items-center justify-content-center mb-3">
            <div class="d-flex align-items-center border border-3">
                <div class="align-items-center">
                    <img src="/static/icons/ping-pong.png" width="25px" height="25px" alt="paddle-color-icon">
                </div>
                <div>
                    <input style="height: 50px" type="color" bind:value={paddle_color}>
                </div>
            </div>
            <div class="d-flex align-items-center border border-3">
                <div class="align-items-center">
                    <img src="/static/icons/ball.png" width="25px" height="25px" alt="ball-color-icon">
                </div>
                <div>
                    <input style="height: 50px" type="color" bind:value={ball_color}>
                </div>
            </div>
            <div class="d-flex align-items-center border border-3">
                <div class="align-items-center">
                    <img src="/static/icons/score.png" width="25px" height="25px" alt="score-color-icon">
                </div>
                <div>
                    <input style="height: 50px" type="color" bind:value={text_color}>
                </div>
            </div>
        </div>
    {/if}
</div>

<svelte:window on:keydown|preventDefault={keyHandler} bind:innerWidth bind:innerHeight/>
{#if data !== undefined}
    <PlayersInfo leftPlayer="{data.leftPlayer}" rightPlayer="{data.rightPlayer}"/>

    <Field bind:this={field}
           leftPlayer="{data.leftPlayer}"
           rightPlayer="{data.rightPlayer}"
           paddle="{data.paddle}"
           ball="{data.ball}"
           field="{data.field}"
           paddle_color="{paddle_color}"
           ball_color="{ball_color}"
           text_color="{text_color}"
           custom_interface="{custom_interface}"/>

    {#if !is_ready}
        <div class="h-100 d-flex align-items-center justify-content-center mt-5">
            <button on:click={() => {$game_socket.emit('ready'); is_ready = true}}>Ready</button>
        </div>
    {:else}
        <div class="mt-5"></div>
    {/if}
	<br>
	Play the game using the up ⬆️ and down ⬇️ arrows.
	<br>
	The game ends when a player reaches 12 points or leaves the game.
{/if}
