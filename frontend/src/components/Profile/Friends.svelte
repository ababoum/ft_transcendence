<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import {
		delete_friend,
		get_friends,
		get_user_public_data,
	} from "../../stores/requests";
	import Avatar from "../Avatar.svelte";
	import { Modal as InviteModal } from "svelte-simple-modal";
	import Modal, { getModal } from "./Modal.svelte";
	import { user, friends } from "../../stores/store";
	import InvitationButton from "../Game/Invitations/InvitationButton.svelte";

	export let profile_data;
	let profile = undefined;
	$: profile = profile_data;

	let user_to_display_nickname: string;

	$: user_to_display = get_user_public_data(user_to_display_nickname);

	onMount(async () => {
		$friends = await get_friends(profile.login);
	});

	async function deleteFriend(nickname: string) {
		// ask for confirmation before deletion
		if (
			!window.confirm(
				`Are you sure you want to delete ${nickname} from your friends list?`
			)
		)
			return;

		// Send data to the API
		const resp = await delete_friend(nickname);
		window.location.reload();
	}

	async function displayUserProfile(nickname: string) {
		user_to_display_nickname = nickname;

		getModal("user_profile").open();
	}
</script>

<div class="container">
	<div class="row d-flex justify-content-center">
		<div class="col-md-8">
			<div class="people-nearby">
				{#if $friends.length == 0}
					<p class="text-center">You don't have any friends yet!</p>
				{/if}
				{#each $friends as { nickname, status, login }}
					<div class="nearby-user">
						<div class="row d-flex align-items-center">
							<div class="col-md-2 col-sm-2">
								<Avatar size="100" {login} />
							</div>
							<div class="col-md-7 col-sm-7">
								<h5>
									<span
										on:click={() =>
											displayUserProfile(nickname)}
										class="profile-link">{nickname}</span
									>
								</h5>
								<p><strong>Status: </strong>{status}</p>
							</div>
							<div class="col-md-3 col-sm-3">
								<InviteModal>
									<InvitationButton {login} />
								</InviteModal>
								<button
									on:click={() => deleteFriend(nickname)}
									class="btn btn-danger pull-right"
									>Delete</button
								>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<!-- DISPLAY ANOTHER USER'S PROFILE -->

<Modal id="user_profile">
	<div class="d-flex flex-column justify-content-center align-items-center">
		<h1>{user_to_display_nickname}</h1>
		{#await user_to_display}
			<p>Profile loading...</p>
		{:then user_profile}
			<Avatar
				login={user_profile.login}
				size="100"
				classes="rounded-circle"
			/>
			<div>
				<strong>Email</strong>: {user_profile.email}
			</div>
			<div class="d-flex flex-column justify-content-center align-items-center">
				<div><strong>⭐ Rating ⭐</strong></div>
				<div class="rating-text">{user_profile.rating}</div>
			</div>
		{/await}
	</div>
</Modal>

<style>
	.people-nearby .nearby-user {
		padding: 20px 0;
		border-top: 1px solid #f1f2f2;
		border-bottom: 1px solid #f1f2f2;
		margin-bottom: 20px;
	}

	.profile-link {
		cursor: pointer;
	}

	.rating-text {
		color: rgb(255, 183, 0);
		font-size: 200%;
		font-weight: bold;
		text-shadow: 1px 1px #392308;
	}
</style>
