<script lang="ts">
	import {getContext, onDestroy} from 'svelte';
	import {game_socket, user} from "../../stores/store";
	import Game from "./Game.svelte";

	const {open} = getContext('simple-modal');

	let is_searching: boolean = false;
	$: is_searching_resp = is_searching;

	async function findGame() {
		if (is_searching) {
			$game_socket.emit('find-game-stop');
			is_searching = false;
			return;
		}
		$game_socket.on('find-game', (data) => {
			if (data['status'] == 'searching')
				is_searching = true;
			if (data['status'] == 'found') {
				$game_socket.off('find-game');
				is_searching = false;
				open(Game, {}, {
					styleWindow: {
						width: '100%'
					}
				});
			}
		});
		$game_socket.emit('find-game', $user);
	}

	onDestroy(() => {
		$game_socket.removeListener('find-game');
		$game_socket.removeListener('get-games-list');
	})


</script>

<button on:click={findGame}> {is_searching_resp ? "Searching..." : "Find Game" }</button>