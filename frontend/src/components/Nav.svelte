<script lang="ts">
	import {
		PROFILE_PAGE,
		LOBBY_PAGE,
		LOGIN_PAGE,
		CHATROOM_PAGE,
		user, game_socket,
	} from "../stores/store";
	import { onMount } from "svelte";
	import { link } from "svelte-spa-router";
	import {getCookie, logout} from "../stores/auth";

	onMount(async () => {
		try { $user = await $user.upd(); } 
		catch (e) {}});

	async function call_logout() {
		await logout();
		$user = await $user.upd();
	}
</script>

<main>
	<nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
		<div class="container-fluid">
			<a class="navbar-brand" href={$LOBBY_PAGE} use:link>
				<img src="static/logo.png" alt="" width="40" height="30" />
				TRANSCENDENCE
			</a>
			<button
				class="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarNav"
				aria-controls="navbarNav"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span class="navbar-toggler-icon" />
			</button>
			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav">
					<li class="nav-item">
						<a
							id="prof-page"
							class="nav-link"
							href={$PROFILE_PAGE}
							use:link>PROFILE</a
						>
					</li>
					<li class="nav-item">
						<a class="nav-link" href={$CHATROOM_PAGE} use:link
							>CHATROOM</a
						>
					</li>
					{#if !$user.isLogged}
						<li class="nav-item">
							<a class="nav-link" href={$LOGIN_PAGE} use:link
								>LOGIN</a
							>
						</li>
					{:else}
						<li class="nav-item">
							<a
								class="nav-link"
								on:click={call_logout}
								href={$LOGIN_PAGE}
								use:link>LOGOUT</a
							>
						</li>
					{/if}
				</ul>
			</div>
		</div>
	</nav>
</main>
