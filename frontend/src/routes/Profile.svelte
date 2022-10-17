<script lang="ts">
	import Header from "../components/Nav.svelte";
	import { link, push } from "svelte-spa-router";
	import { game_socket } from "../stores";
	import { onMount } from "svelte";
	import type { loginBase } from "../types";
	import ProfileImage from "../components/Profile/ProfileImage.svelte";
	import { get_current_user_data } from "../auth";

	// retrieve current user info

	async function profileBuild(): Promise<loginBase> {
		const resp = await get_current_user_data();
		const payload = await resp.json();

		if (resp.ok) {
			return payload;
		} else {
			throw new Error("You must be logged in to view your profile");
		}
	}

	let loginPayload = profileBuild();
</script>

<Header />

{#await loginPayload}
	<div>Loading...</div>
{:then loginPayload_loaded}
	<div class="profile-container">
		<ProfileImage loginPayload={loginPayload_loaded} />
	</div>
{:catch error}
	<div class="profile-container">You must log in to view your profile.</div>
{/await}


<style>
	.profile-container {
		text-align: center;
		padding: 10px;
		background-color: var(--white2);
	}
</style>
