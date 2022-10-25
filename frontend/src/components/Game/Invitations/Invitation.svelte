<script lang="ts">
	import {getContext, onMount} from 'svelte';
    import {game_socket} from "../../../stores/store";
	import Game from "../Game.svelte";
	import DeclinedInvitation from "./DeclinedInvitation.svelte";
	import InvitationMessage from "./InvitationMessage.svelte";
    const { open } = getContext('simple-modal');

    let friends_nickname: string;

    onMount(() => {
        $game_socket.on('game-invite', (data) => {
            friends_nickname = data.inviter;
			open(InvitationMessage, { friends_nickname: friends_nickname });
        });

		$game_socket.on('game-invite-accept', () => {
			open(Game, {}, {
				styleWindow: {
					width: '100%'
				}
			});
        });

        $game_socket.on('game-invite-decline', () => {
			open(DeclinedInvitation);
        });
    });
</script>