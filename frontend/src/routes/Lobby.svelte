<script lang="ts">
	import Header from "../components/Nav.svelte";
	import {push} from "svelte-spa-router";
	import {game_socket, is_spectator, user} from "../stores/store";
	import {onDestroy, onMount} from "svelte";
	import MatchList from "../components/Lobby/MatchList.svelte";
	import PlayersRating from "../components/Lobby/PlayersRating.svelte";
	import Statistics from "../components/Lobby/Statistics.svelte";
	import {Modal} from "svelte-simple-modal";
	import GamePopup from "../components/Game/GamePopup.svelte";

	//GAME STAT

	let game_list;

	onMount(async () => {
		$user = await $user.upd()
		$game_socket.on('get-games-list', (data) => {
			game_list = data;
		});
	});
</script>

<main>

    <Header/>
    <Statistics game_list="{game_list}"/>

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
    <!--
    {#if $user.isLogged}
            <p class="mb-3"> Hello, [login: {$user.login}], [id: {$user.id}], [nickname: {$user.nickname}]</p>
    {/if}
    -->
</main>