<script lang="ts">
	import {getContext} from 'svelte';
	import Spectator from "./Spectator.svelte";
	import {game_socket} from "../../stores/store";

	const {open} = getContext('simple-modal');

	export let id1: string;
	export let id2: string;
	const run = () => {
		open(Spectator, {}, {
			styleWindow: {
				width: '100%'
			}
		});
		spectate(id1, id2)
	};

	async function spectate(id1: string, id2: string) {
		$game_socket.emit('spectate', {
			id1: id1,
			id2: id2
		});
	}

</script>

<span class="badge bg-primary rounded-pill" style="cursor: default"
      on:click={run}>Spectate</span>

