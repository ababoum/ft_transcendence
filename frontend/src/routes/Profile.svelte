<script lang="ts">
	import Header from "../components/Nav.svelte";
	import { onMount } from "svelte";
	import ProfileImage from "../components/Profile/ProfileImage.svelte";
	import { get_full_profile } from "../stores/requests";
	import { user } from "../stores/store";
	import ProfileAbout from "../components/Profile/ProfileAbout.svelte";
	import {Modal} from "svelte-simple-modal";
	import InvitationButton from "../components/Game/Invitations/InvitationButton.svelte";
    import Friends from "../components/Profile/Friends.svelte";
    import AddFriend from "../components/Profile/AddFriend.svelte";
    import MatchHistory from "../components/Profile/MatchHistory.svelte";

	// retrieve current user info

	$: full_profile = undefined;
	const loading_imageSrc = "static/loading_icon.gif";

	onMount(async () => {
		$user = await $user.upd();
		await get_full_profile($user.login).then((data) => {
			full_profile = data;
		});
	});
	let log;
</script>

<Header />

{#if full_profile === undefined}
	<div class="profile-container">
		<img src={loading_imageSrc} alt="avatar" class="avatar-img" />
	</div>
{:else if full_profile === null}
	<div class="profile-container">
		You must be logged in to view your profile
	</div>
{:else}
	<div class="profile-container">
		<h1 class="profile-title">My profile</h1>
		<ProfileImage profile_data={full_profile} />
		<ProfileAbout profile_data={full_profile} />
		<h1 class="profile-title">Add new friends</h1>
		<AddFriend profile_data={full_profile} />
		<h1 class="profile-title">My friends</h1>
		<Friends profile_data={full_profile} />
		<h1 class="profile-title">My games</h1>
		<MatchHistory profile_data={full_profile} />
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

	.profile-title {
		width: 100%;
		background-color: rgb(0,80,160);
		color: white;
		text-align: center;
		padding: 10px;
		border-radius: 10px;
	}
</style>
