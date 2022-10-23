<script lang="ts">
	import {onDestroy, onMount} from 'svelte';
	import {game_socket} from "../../stores/store";
	import Field from "./Field.svelte";
	import PlayersInfo from "./PlayersInfo.svelte";

	let field;
	let paddle_color: string = "#FFFFFF";
	let ball_color: string = "#0000FF";
	let text_color: string = "#FFFF00";
	let match_finished: boolean = false;
	let data: object;

	function draw() {
		try {
			if (!match_finished)
				field.draw();
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
           text_color="{text_color}"/>
{/if}
