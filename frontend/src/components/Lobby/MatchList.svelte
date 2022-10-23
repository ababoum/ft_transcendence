<script lang="ts">
	import {onDestroy} from "svelte";
	import {game_socket} from "../../stores/store";
	import Avatar from "../Avatar.svelte";
	import {Modal} from "svelte-simple-modal";
	import SpectatorPopup from "../Game/SpectatorPopup.svelte";

	export let game_list;

	onDestroy(() => {
		$game_socket.removeListener('get-games-list');
	});
</script>


    <div class="card mt-5 container-xl">
        <div class="card-header bg-white border-bottom-0 py-4">
            <h4 class="mb-0">Game List</h4>
        </div>
        <div class="table-responsive">
            <table class="table text-nowrap mb-0">
                <thead class="table-light">
                <tr>
                    <th>Player</th>
                    <th>Score</th>
                    <th>Watch</th>
                    <th>Score</th>
                    <th>Player</th>
                </tr>
                </thead>
                <tbody>
                {#if game_list !== undefined}
                    {#if game_list.games.length === 0}
                        <div class="align-middle text-danger">
                            <p> No games online </p>
                        </div>
                    {/if}
                    {#each game_list.games as game}
                        <tr>
                            <td class="align-middle">
                                <div class="d-flex align-items-center">
                                    <div>
                                        <Avatar login="{game.leftPlayer.login}" size="50"/>
                                    </div>
                                    <div class="ms-3 lh-1">
                                        <h5 class="fw-bold mb-1">{game.leftPlayer.nickname}</h5>
                                    </div>
                                </div>
                            <td class="align-middle">{game.leftPlayer.score}</td>
                            <td class="align-middle">
                                <Modal>
                                    <SpectatorPopup id1="{game.leftPlayer.id}" id2="{game.rightPlayer.id}"/>
                                </Modal>
                            </td>
                            <td class="align-middle">{game.rightPlayer.score}</td>
                            <td class="align-middle">
                                <div class="d-flex
                            align-items-center">
                                    <div>
                                        <Avatar login="{game.rightPlayer.login}" size="50"/>
                                    </div>
                                    <div class="ms-3 lh-1">
                                        <h5 class="fw-bold mb-1">{game.rightPlayer.nickname}</h5>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    {/each}
                {:else}
                    <div class="align-middle text-danger">
                        <p> No games online </p>
                    </div>
                {/if}
                </tbody>
            </table>
        </div>
    </div>

<style>
    .card-header {
        padding: 0.75rem 1.5rem;
        margin-bottom: 0;
        background-color: rgba(0, 0, 0, 0.03);
        border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
</style>