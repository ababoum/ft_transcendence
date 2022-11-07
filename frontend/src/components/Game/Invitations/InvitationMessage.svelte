<script lang="ts">
	import {game_socket} from "../../../stores/store";
	import {getContext, onDestroy, onMount} from "svelte";

	const {close} = getContext('simple-modal');


	export let friends_nickname;
	let destroy = true;

	onMount(() => {
		$game_socket.on('close-invitation', () => {
			destroy = false;
			close();
		});
	});

	onDestroy(() => {
		if (destroy)
			$game_socket.emit('game-invite-decline');
	});

</script>

{#if destroy}
    <div class="justify-content-center text-center">
        <h1> {friends_nickname} has invited you to play</h1>
        <div class="row justify-content-center">
            <button class="col-sm-3" on:click={$game_socket.emit('game-invite-accept')}> Accept</button>
            <button class="col-sm-3" on:click={$game_socket.emit('game-invite-decline')}> Decline</button>
        </div>
    </div>
{/if}
