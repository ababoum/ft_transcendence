<script lang="ts">
	import { getContext } from "svelte";
	import Spectator from "./Spectator.svelte";
	import { game_socket } from "../../stores/store";

	const { open } = getContext("simple-modal");

	export let login: string;
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
		spectate(login);
	};

	async function spectate(login: string) {
		$game_socket.emit("spectate", login);
	}
</script>

<span
	class="badge bg-primary rounded-pill"
	style="cursor: default"
	on:click={run}>Spectate</span
>
