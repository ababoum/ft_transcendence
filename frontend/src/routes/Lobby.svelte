<script lang="ts">
	import Header from "../components/Nav.svelte";
	import {push} from "svelte-spa-router";
	import {game_socket, user} from "../stores/store";
	import {onDestroy, onMount} from "svelte";
	import MatchList from "../components/Lobby/MatchList.svelte";
	import PlayersRating from "../components/Lobby/PlayersRating.svelte";

	let is_searching: boolean = false;
	$: is_searching_resp = is_searching;

	onMount(async ()=> $user = await $user.upd());

	async function findGame() {
		if (!$user.isLogged) {
			await push('/log');
			return;
		}
		if (is_searching) {
			$game_socket.emit('find-game-stop');
			is_searching = false;
			return;
		}
		$game_socket.on('find-game', (data) => {
			if (data['status'] == 'searching')
				is_searching = true;
			if (data['status'] == 'found') {
				push('/game');
				$game_socket.off('find-game');
			}
		});
		$game_socket.emit('find-game', $user);
	}

	onDestroy(() => {
		$game_socket.removeListener('find-game');
	})
</script>

<main>
    <Header/>
    {#if $user.isLogged !== undefined}
            <p class="mb-3"> Hello, [login: {$user.login}], [id: {$user.id}], [nickname: {$user.nickname}]</p>
    {/if}
    <div class="h-100 d-flex align-items-center justify-content-center">
        {#if !$user.isLogged}
            <p> You are not login </p>
        {:else}
            <button on:click={findGame}> {is_searching_resp ? "Searching..." : "Find Game" }</button>
        {/if}
    </div>
    <div class="container mt-4">
        <div class="row">
            <div class="col-sm">
                <MatchList/>
            </div>
            <div class="col-sm">
                <PlayersRating/>
            </div>
        </div>
    </div>
</main>