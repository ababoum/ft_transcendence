<script lang="ts">
	import Header from "../components/Nav.svelte";
	import { link, push } from "svelte-spa-router";
	import { get_current_user_data, GAME_URL, game_socket } from "../stores";
	import { onMount } from "svelte";
	import { io } from "socket.io-client";
	import type { loginBase } from "../types";
    import { GAME_DOMAIN } from "../domain";

	let tmp: loginBase;
	onMount(async () => {
		tmp = await get_current_user_data();
	});
	$: is_logged = tmp.is_logged_in;

	let is_searching: boolean = false;
	$: is_searching_resp = is_searching;

	let profile = undefined;
	async function findGame() {
		tmp = await get_current_user_data();
		if (!is_logged) {
			await push("/log");
			return;
		}
		if (is_searching) return;
		$game_socket = io(`${GAME_DOMAIN}`);
		$game_socket.on("find-game", (data) => {
			if (data["status"] == "searching") is_searching = true;
			if (data["status"] == "found") {
				console.log("ok");
				push("/game");
				$game_socket.off("find-game");
			}
		});
		profile = await get_current_user_data(); //FIXME if is not ok protection
		$game_socket.emit("find-game", profile);
	}
</script>

<main>
	<Header />
	{#if !is_logged}
		<p>You are not logged in.</p>
	{:else}
		<p>Hello from Lobby (list of matches and start game) page</p>
		<button on:click={findGame}>
			{is_searching_resp ? "Searching..." : "Find Game"}</button
		>
	{/if}
</main>
