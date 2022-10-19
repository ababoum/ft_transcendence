<script lang="ts">
	import {PROFILE_PAGE, GAME_PAGE, LOBBY_PAGE, LOGIN_PAGE, CHATROOM_PAGE} from "../stores";
	import {onMount} from "svelte";
	import {link, push} from "svelte-spa-router";
	import {eraseCookie, is_authenticated} from "../auth.js";

	let tmp: boolean;
	onMount(async () => { tmp = await is_authenticated(); });
	$: is_logged = tmp;

	async function logout() {
		eraseCookie("jwt");
		await push($LOGIN_PAGE);
	}
</script>

<main>
	<nav class="navbar navbar-expand-lg navbar-light bg-light">
		<div class="container-fluid">
			<a class="navbar-brand" href="{$LOBBY_PAGE}" use:link>
				<img src="static/logo.png" alt="" width="40" height="30">
				TRANSCENDENCE
			</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
					aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav">
					<li class="nav-item">
						<a class="nav-link" href={$PROFILE_PAGE} use:link>PROFILE</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href={$GAME_PAGE} use:link>GAME</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href={$CHATROOM_PAGE} use:link>CHATROOM</a>
					</li>
					{#if !is_logged}
						<li class="nav-item">
							<a class="nav-link" href="{$LOGIN_PAGE}" use:link>LOGIN</a>
						</li>
					{:else}
						<li class="nav-item">
							<a class="nav-link" on:click={logout} href="{$LOGIN_PAGE}" use:link>LOGOUT</a>
						</li>
					{/if}
				</ul>
			</div>
		</div>
	</nav>
	<br><br>
</main>