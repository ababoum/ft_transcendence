<script lang="ts">
	import Header from "../components/Nav.svelte";
	import {game_socket, show_nav, user} from "../stores/store";
	import {onDestroy, onMount} from "svelte";
	import MatchList from "../components/Lobby/MatchList.svelte";
	import PlayersRating from "../components/Lobby/PlayersRating.svelte";
	import Statistics from "../components/Lobby/Statistics.svelte";
	import {Modal} from "svelte-simple-modal";
	import GamePopup from "../components/Game/GamePopup.svelte";

	//GAME STAT

	let game_list;
	let players_count;

	onMount(async () => {
        $user = await $user.upd()
		$game_socket.on('get-games-list', (data, pc) => {
			game_list = data;
			players_count = pc;
		});
		$game_socket.emit('get-games-list');
	});

	onDestroy(() => $game_socket.removeListener('get-games-list'));
</script>

<main>
    {#if $show_nav}
        <Header />
    {/if}



    <Statistics game_list="{game_list}" players_count="{players_count}"/>

    <div class="h-100 d-flex align-items-center justify-content-center mt-5">
        {#if !$user.isLogged}
            <p style="color: red"> You need to login to play </p>
        {:else}
            <Modal>
                <GamePopup/>
            </Modal>
        {/if}
    </div>

    <MatchList game_list="{game_list}"/>
    <PlayersRating/>
</main>