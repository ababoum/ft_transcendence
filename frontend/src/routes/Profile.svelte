<script lang="ts">
	import Header from "../components/Nav.svelte";
	import { onMount } from "svelte";
	import ProfileImage from "../components/Profile/ProfileImage.svelte";
	import { get_full_profile } from "../stores/requests";
	import { user } from "../stores/store";
	import ProfileAbout from "../components/Profile/ProfileAbout.svelte";

	// retrieve current user info

	let full_profile = undefined;

	onMount(async () => {
		$user = await $user.upd();
		await get_full_profile($user.login).then((data) => {
			full_profile = data;
		});
	});
</script>

<Header />

{#if full_profile === undefined}
	<div>Loading...</div>
{:else if full_profile === null}
	<div class="profile-container">
		You must be logged in to view your profile
	</div>
{:else}
	<div class="profile-container">
		<ProfileImage profile_data={full_profile} />
		<ProfileAbout {...full_profile} />
	</div>
{/if}

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
