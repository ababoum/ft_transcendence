<script lang="ts">
	import { game_socket } from "../../../stores/store";
	import {onDestroy, onMount} from "svelte";

	export let login;
	let invite: boolean = true;

	onMount(() => {
		$game_socket.on("game-invite-status", (resp) => {
			if (resp["status"] === "sent")
				invite = false;
			else if (resp["status"] === "annulled")
				invite = true;
        });
    });

	onDestroy(() => {
		$game_socket.emit("game-invite-delete");
		$game_socket.removeListener("game-invite");
    });

	async function findGame() {
		if (invite)
		    $game_socket.emit("game-invite", login);
		else
			$game_socket.emit("game-invite-delete");
	}
</script>

<button class="btn btn-primary pull-right" on:click={findGame}
>{invite ? "Invite to play " : "Delete invitation"}</button
>