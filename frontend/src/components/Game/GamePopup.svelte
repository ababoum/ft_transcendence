<script lang="ts">
	import {getContext, onDestroy, onMount} from "svelte";
	import {game_socket, user} from "../../stores/store";
	import Game from "./Game.svelte";

	const {open} = getContext("simple-modal");
	let is_searching: boolean = false;

	async function findGame() {
		if (is_searching) {
			$game_socket.emit("find-game-stop");
			is_searching = false;
			return;
		}

		$game_socket.on("find-game", (data) => {
			if (data["status"] == "searching") is_searching = true;
			if (data["status"] == "found") {
				is_searching = false;
				open(Game,
					{},
					{
						styleWindow: {
							width: "100%",
						},
					}
				);
			}
        });
		$game_socket.emit("find-game", $user);
	}

	onMount(() => {

	});

	onDestroy(() => {
		$game_socket.removeListener("find-game");
	});
</script>

<div>
    <button on:click={findGame}>
        {is_searching ? "Searching..." : "Find Game"}
    </button>
</div>
