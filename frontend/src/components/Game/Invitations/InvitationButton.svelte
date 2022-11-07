<script lang="ts">
	import { game_socket } from "../../../stores/store";

	export let login;

	async function findGame() {
		$game_socket.emit("game-invite", login);
	}
</script>

<button class="btn btn-primary pull-right" on:click={findGame}
>Invite to play</button
>