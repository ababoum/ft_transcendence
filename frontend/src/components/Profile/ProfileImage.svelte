<script lang="ts">
	import type { loginBase } from "../../types";
	import { get } from "svelte/store";
	export let loginPayload: loginBase;
	import { BACKEND_URL } from "../../stores";
	
	let default_imageSrc = "static/default_avatar.png";
	let actual_img = default_imageSrc;
	$: img_url = actual_img;

	const imageSrc = (async () => {
		const resp = await fetch(
			get(BACKEND_URL) + "/users/image/" + loginPayload.imageId
		);
		const imageBlob = await resp.blob();
		console.log(imageBlob);
		const reader = new FileReader();
		reader.readAsDataURL(imageBlob);
		
		reader.onload = function (e) {
			var rawLog = reader.result;
			if (resp.ok) {
				actual_img = rawLog as string;
			} else {
				throw new Error();
			}
		}
	})();
</script>

{#await imageSrc}
	<div class="avatar">
		<img src={default_imageSrc} alt="profile" class="avatar-img" />
	</div>
{:then data}
	<div class="avatar">
		<img src={actual_img} alt="profile" class="avatar-img" />
	</div>
{:catch error}
	<div class="avatar">
		<img src={default_imageSrc} alt="profile" class="avatar-img" />
	</div>
{/await}

<style>
	.avatar {
		text-align: center;
		margin: 20px;
	}

	.avatar-img {
		width: 200px;
		border-radius: 50%;
		border-color: black;
		border: 5px solid;
	}
</style>
