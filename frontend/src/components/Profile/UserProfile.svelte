<script context="module" lang="ts">
    import { onMount } from "svelte";
    import { get_user_public_data } from "../../stores/requests";
	import Avatar from "../Avatar.svelte";
	import Modal, { getModal } from "./Modal.svelte";

	export let user_to_display;

	export function getUserProfile() {
		return getModal();
	}


</script>

<Modal>
	<div class="d-flex flex-column justify-content-center align-items-center">
		{#if !user_to_display}
			<p>Profile loading...</p>
		{:else}
			<h1>{user_to_display.nickname}</h1>
			<Avatar
				login={user_to_display.login}
				size="100"
				classes="rounded-circle"
			/>
			<div>
				<strong>Email</strong>: {user_to_display.email}
			</div>
			<div
				class="d-flex flex-column justify-content-center align-items-center"
			>
				<div><strong>⭐ Rating ⭐</strong></div>
				<div class="rating-text">{user_to_display.rating}</div>
			</div>
		{/if}
	</div>
</Modal>

<style>
	.rating-text {
		color: rgb(255, 183, 0);
		font-size: 200%;
		font-weight: bold;
		text-shadow: 1px 1px #392308;
	}
</style>
