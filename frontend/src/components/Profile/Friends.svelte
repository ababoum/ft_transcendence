<script lang="ts">
	import { onMount } from "svelte";
	import { delete_friend, get_friends } from "../../stores/requests";
	import Avatar from "../Avatar.svelte";
	import { Modal as InviteModal } from "svelte-simple-modal";
	import { getModal } from "./Modal.svelte";
	import { friends } from "../../stores/store";
	import InvitationButton from "../GlobalModal/InvitationButton.svelte";
	import UserProfile from "./UserProfile.svelte";

	export let profile_data;
	let profile = undefined;
	$: profile = profile_data;

	let user_to_display_nickname: string = "";

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
		$friends = await get_friends(profile.login);
	}

	async function displayUserProfile(nickname: string) {
		const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

		user_to_display_nickname = nickname;
		while (typeof getModal !== "function") await sleep(500);
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
								<Avatar size="75" {nickname} />
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
									<InvitationButton {nickname} />
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

<UserProfile bind:user_to_display_nickname={user_to_display_nickname} />

<style>
	.people-nearby .nearby-user {
		padding: 20px 0;
		border-top: 1px solid #f1f2f2;
		border-bottom: 1px solid #f1f2f2;
		margin-bottom: 20px;
		margin-left: 5px;
		margin-right: 5px;
	}

	.profile-link {
		cursor: pointer;
	}
</style>
