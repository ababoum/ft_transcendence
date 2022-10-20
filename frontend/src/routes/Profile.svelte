<script lang="ts">
	import Header from "../components/Nav.svelte";
	import { onMount } from "svelte";
	import type { loginBase } from "../types";
	import ProfileImage from "../components/Profile/ProfileImage.svelte";
	import { get_current_user_data } from "../stores/requests";
	import ProfileAbout from "../components/Profile/ProfileAbout.svelte";

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

	let loginPayload = undefined;
	onMount(async () => {
		loginPayload = profileBuild();
	});
	$: login = loginPayload.then((data) => data.userLogin);
</script>

<Header />

{#await loginPayload}
	<div>Loading...</div>
{:then loginPayload_loaded}
	<div class="profile-container">
		<ProfileImage loginPayload={loginPayload_loaded} />
		<ProfileAbout loginPayload={loginPayload_loaded} />
	</div>
{:catch error}
	<div class="profile-container">{error.message}</div>
{/await}

<style>
	.profile-container {
		display: grid;
		width: 100%;
		justify-items: center;
		align-items: center;
		padding: 10px;
		background-color: var(--white2);
	}
</style>
