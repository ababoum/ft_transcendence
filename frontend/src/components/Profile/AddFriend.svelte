<script lang="ts">
	import { onMount } from "svelte";
	import { add_friend } from "../../stores/requests";

	export let profile_data;
	let profile = undefined;
	$: profile = profile_data;

	let msg = "";

	async function AddFriend(e) {
		// Get the data from the form
		const formData = new FormData(e.target);
		const nickname = formData.get("nickname").toString();

		if (nickname == profile.nickname) {
			msg = `<p class="text-danger">You cannot add yourself as friend</p>`;
			return ;
		}

		// Send data to the API
		const resp = await add_friend(nickname);

		if (resp.ok) {
			// msg = `<p class="text-success">User successfully added as friend</p>`;
			window.location.reload();
		} else {
			msg = `<p class="text-danger">${await resp
				.json()
				.then((data) => data.message)}</p>`;
		}
	}

	onMount(async () => {});
</script>

<div class="m-3 d-flex justify-content-center">
	<form on:submit|preventDefault={AddFriend}>
		<input
			type="text"
			name="nickname"
			placeholder="Type a player's nickname"
		/>
		<button type="submit" class="btn btn-info">Add as friend</button>
	</form>
</div>
{#if msg}
	{@html msg}
{/if}

<style>
</style>
