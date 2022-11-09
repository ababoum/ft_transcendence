<script lang="ts">
	import {getContext, onMount} from 'svelte';
	import {game_socket} from "../../stores/store";
	import Game from "../Game/Game.svelte";
	import InvitationMessage from "./InvitationMessage.svelte";
	import NotificationMsg from "./NotificationMsg.svelte";
	const { open } = getContext('simple-modal');

	let friends_nickname: string;

	onMount(() => {
		$game_socket.on('game-invite', (data) => {
			friends_nickname = data.inviter;
			open(InvitationMessage, { friends_nickname: friends_nickname });
		});

		$game_socket.on('game-invite-accept', () => {
			console.log("CALLED")
			open(Game, {}, {
				styleWindow: {
					width: '100%'
				}
			});
		});

		$game_socket.on('notification', (data) => {
			open(NotificationMsg, {message: data.message});
		});
	});
</script>