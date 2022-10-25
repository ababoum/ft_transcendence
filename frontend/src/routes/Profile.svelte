<script lang="ts">
	import Header from "../components/Nav.svelte";
	import { onMount } from "svelte";
	import ProfileImage from "../components/Profile/ProfileImage.svelte";
	import { get_full_profile } from "../stores/requests";
	import { user } from "../stores/store";
	import ProfileAbout from "../components/Profile/ProfileAbout.svelte";
	import {Modal} from "svelte-simple-modal";
	import InvitationButton from "../components/Game/Invitations/InvitationButton.svelte";

	// retrieve current user info

	let full_profile = undefined;
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

<input type="text" id="typeTextX" class="form-control form-control-lg"
	   required bind:value={log}/>
<Modal>
	<InvitationButton login="{log}"/>
</Modal>

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
