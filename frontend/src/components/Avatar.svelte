<script context="module">
	const elements = new Set();
</script>

<script lang="ts">
	import { myavatar } from "../stores/store";
	import { get } from "svelte/store";

	import { BACKEND_URL, GET_NICKNAME_AVATAR } from "../stores/store";
	import { beforeUpdate, onMount } from "svelte";

	export let size;
	export let nickname = "";
	export let classes = "";
	export let personal: boolean = false;

	// default paths
	let default_imageSrc = "static/default_avatar.png";
	let loading_imageSrc = "static/loading_icon.gif";
	let actual_img = default_imageSrc;
	let fetchImage;

	async function refresh_avatar() {
		const resp1 = await fetch(
			get(BACKEND_URL) + "/users/avatar/" + nickname
		);
		const resp2 = await fetch(
			get(BACKEND_URL) + "/users/ft_avatar/" + nickname
		);

		if (resp1.ok) {
			const imageBlob = await resp1.blob();
			const reader = new FileReader();
			reader.readAsDataURL(imageBlob);

			reader.onload = function (e) {
				var rawLog = reader.result;
				actual_img = rawLog as string;
			};
		} else if (resp2.ok) {
			const url = await resp2.text();
			if (!url) throw new Error();
			actual_img = url;
		} else {
			throw new Error();
		}
	}

	onMount(async () => {
		fetchImage = refresh_avatar();
	});

	beforeUpdate(() => {
		fetchImage = refresh_avatar();
	});
</script>

{#if (!$myavatar && personal === true) || personal === false}
	<div class={classes}>
		{#await fetchImage}
			<img
				src={loading_imageSrc}
				alt="profile"
				class="avatar-img"
				style="width: {size}px;"
			/>
		{:then data}
			<img
				src={actual_img}
				class={classes}
				style="width: {size}px;"
				alt="Avatar"
			/>
		{:catch error}
			<img
				src={default_imageSrc}
				alt="profile"
				class={classes}
				style="width: {size}px;"
			/>
		{/await}
	</div>
{:else}
	<div class={classes}>
		<img
			src={$myavatar}
			alt="profile"
			class="avatar-img"
			style="width: {size}px;"
		/>
	</div>
{/if}
