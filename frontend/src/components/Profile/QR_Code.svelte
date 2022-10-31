<script context="module">
	const elements = new Set();
</script>

<script lang="ts">
	import { get } from "svelte/store";
	import { getCookie } from "../../stores/auth";
	import { BACKEND_URL } from "../../stores/store";

	export let size;
	export let classes = "";

	// default paths
	let error_imageSrc = "static/error.png";
	let loading_imageSrc = "static/loading_icon.gif";
	let actual_img = loading_imageSrc;

	const fetchImage = (async () => {
		const resp = await fetch(get(BACKEND_URL) + "/2fa/generate", {
			method: "POST",
			headers: { Authorization: "Bearer " + getCookie("jwt") },
		});
		const imageBlob = await resp.blob();
		const reader = new FileReader();
		reader.readAsDataURL(imageBlob);

		reader.onload = function (e) {
			var rawLog = reader.result;
			if (resp.ok) {
				actual_img = rawLog as string;
			} else {
				actual_img = error_imageSrc;
			}
		};
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
			src={error_imageSrc}
			alt="profile"
			class={classes}
			style="width: {size}px;"
		/>
	{/await}
</div>
