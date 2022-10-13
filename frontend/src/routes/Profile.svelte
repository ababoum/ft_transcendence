<script lang="ts">
	import Header from "../components/Nav.svelte";
	import { link, push } from "svelte-spa-router";
	import {game_socket, get_current_user_data } from "../stores";
	import { onMount } from "svelte";
	import type { loginBase } from "../types";
	import ProfileImage from "../components/Profile/ProfileImage.svelte";

	// retrieve current user info
	export let tmp: loginBase;
	onMount(async () => {
		tmp = await get_current_user_data();
	});
	$: is_logged_in = tmp.is_logged_in;
</script>

<main>
	<Header />

	{#if is_logged_in}
		<div class="profile-container">
			<ProfileImage />
		</div>
	{:else}
		<div class="profile-container">
			You must log in to view your profile.
		</div>
	{/if}
</main>

<style>
	.profile-container {
		text-align: center;
		padding: 10px;
		background-color: var(--white2);
	}
</style>
