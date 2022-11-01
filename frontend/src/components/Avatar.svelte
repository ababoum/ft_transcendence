<script context="module">
	const elements = new Set();
</script>

<script lang="ts">
	import { get } from "svelte/store";

	import { BACKEND_URL, GET_LOGIN_AVATAR } from "../stores/store";

	export let size;
	export let login = "";
	export let classes = "";

	// default paths
	let default_imageSrc = "static/default_avatar.png";
	let loading_imageSrc = "static/loading_icon.gif";
	let actual_img = default_imageSrc;

	const fetchImage = (async () => {
		const resp1 = await fetch($GET_LOGIN_AVATAR + login);
		const resp2 = await fetch(
			get(BACKEND_URL) + "/users/ft_avatar/" + login
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
	})();
</script>

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
