<script lang="ts">
	import { getContext } from "svelte";
	import Spectator from "./Spectator.svelte";
	import { game_socket } from "../../stores/store";

	const { open } = getContext("simple-modal");

	export let nickname: string;
	const run = () => {
		open(
			Spectator,
			{},
			{
				styleWindow: {
					width: "100%",
				},
			}
		);
		spectate(nickname);
	};

	async function spectate(nickname: string) {
		$game_socket.emit("spectate", nickname);
	}
</script>

<span
	class="badge bg-primary rounded-pill"
	style="cursor: default"
	on:click={run}
	on:keypress={run}>Spectate</span
>
