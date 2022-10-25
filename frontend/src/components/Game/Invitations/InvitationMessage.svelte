<script>
    import {game_socket} from "../../../stores/store";
    import {onDestroy} from "svelte";

    export let friends_nickname;

    onDestroy(() => {
        $game_socket.emit('game-invite-decline');
    });

</script>

<div class="justify-content-center text-center">
<h1> {friends_nickname} has invited you to play</h1>
    <div class="row justify-content-center">
        <button class="col-sm-3" on:click={$game_socket.emit('game-invite-accept')}> Accept </button>
        <button class="col-sm-3" on:click={$game_socket.emit('game-invite-decline')}> Decline </button>
    </div>
</div>

