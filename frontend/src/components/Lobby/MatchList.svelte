<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import {game_socket} from "../../stores";

	let game_list;
	let interval;

	onMount(() => {
		$game_socket.on('get-games-list', (data) => {
			game_list = data;
		});
	});

	onDestroy(() => {
		clearInterval(interval);
		$game_socket.removeListener('get-games-list');
	});
</script>

<main>
    {#if game_list !== undefined}
        <p> Games online: {game_list.games_online}</p>
        <p> Players online: {game_list.players_online}</p>
        <p> Players in queue: {game_list.players_in_queue}</p>

        <div class="d-inline-flex p-2">
            <ol class="list-group list-group-numbered">
                {#each game_list.games as game}
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                            <div class="fw-bold">{game.leftPlayer.nickname + "(" + game.leftPlayer.score + ") vs "
                            + game.rightPlayer.nickname + "(" + game.rightPlayer.score + ")"}</div>
                        </div>
                        <span class="badge bg-primary rounded-pill">Spectate</span>
                    </li>
                {/each}
            </ol>
        </div>
    {:else}
        <p> Loading statistics ... </p>
    {/if}

</main>