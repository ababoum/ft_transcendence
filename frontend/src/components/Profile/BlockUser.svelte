<script lang="ts">
	import { BACKEND_URL, user } from "../../stores/store";
	import { getCookie } from "../../stores/auth";
    import { get } from "svelte/store";

	let msg = "";
	let nickname_to_block;

	async function blockUser() {
		if (!nickname_to_block) return alert("Please provide a nickname");
		// console.log("In blockUser " + nickname_to_block);
		if (nickname_to_block === $user.nickname)
			return alert("You can't block yourself");

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/users/blockUser/",
			{
				method: "POST",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nickname: nickname_to_block }),
			}
		);
		const res = await rawresponse.json();

		if (res.statusCode === 409)
			msg = `<p class="text-danger">You can't block yourself</p>`;
		else if (res.statusCode === 404)
			msg = `<p class="text-danger">User not found</p>`;
		else if (res.statusCode)
			msg = `<p class="text-danger">Can't block this user</p>`;
		else msg = `<p class="text-success">User successfully blocked</p>`;
	}

	async function unblockUser() {
		if (!nickname_to_block) return alert("Please provide a nickname");
		// console.log("In blockUser " + nickname_to_block);
		if (nickname_to_block === $user.nickname)
			return alert("You can't unblock yourself");

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/users/unblockUser/",
			{
				method: "DELETE",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nickname: nickname_to_block }),
			}
		);
		const res = await rawresponse.json();

		if (res.statusCode === 404)
			msg = `<p class="text-danger">User not found in your blocklist</p>`;
		else if (res.statusCode)
			msg = `<p class="text-danger">Can't unblock this user</p>`;
		else msg = `<p class="text-success">User successfully unblocked</p>`;
	}
</script>

<div class="m-3 d-flex justify-content-center">
	<input
		bind:value={nickname_to_block}
		type="text"
		name="nickname"
		placeholder="Type a player's nickname"
		minlength="1" 
		maxlength="150"
	/>
	<button on:click={blockUser} type="button" class="btn btn-danger mx-2"
		>Block this user</button
	>
	<button on:click={unblockUser} type="button" class="btn btn-secondary mx-2"
		>Unblock this user</button
	>
</div>
{#if msg}
	{@html msg}
{/if}

<style>
</style>
