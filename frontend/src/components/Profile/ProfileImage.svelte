<script lang="ts">
	import { get } from "svelte/store";
	import { BACKEND_URL } from "../../stores/store";
	import { getCookie } from "../../stores/auth";
	import { onMount } from "svelte";
	export let profile_data: any;

	// default paths
	const default_imageSrc = "static/default_avatar.png";
	const loading_imageSrc = "static/loading_icon.gif";
	let imageSrc = undefined;

	// avatar upload
	let fileinput: any;
	const onFileSelected = (e) => {
		let image = e.target.files[0];
		let data = new FormData();
		data.append("file", image);

		fetch(get(BACKEND_URL) + "/users/upload_avatar", {
			method: "POST",
			body: data,
			headers: { Authorization: "Bearer " + getCookie("jwt") },
		}).then(() => {
			// reload current page
			window.location.href = "/#/profile";
		});
	};

	// retrieve avatar picture for the logged in user

	onMount(async () => {
		const resp = await fetch(
			get(BACKEND_URL) + "/users/image/" + profile_data.imageId
		);
		const imageBlob = await resp.blob();
		const reader = new FileReader();
		reader.readAsDataURL(imageBlob);
		reader.onload = function (e) {
			var rawLog = reader.result;
			if (resp.ok) {
				imageSrc = rawLog;
			} else {
				imageSrc = null;
			}
		};
	});
</script>

{#if imageSrc === undefined}
	<div class="avatar">
		<img src={loading_imageSrc} alt="profile" class="avatar-img" />
	</div>
{:else if imageSrc === null}
	<div class="avatar">
		$${console.log(imageSrc)}
		<img src={default_imageSrc} alt="profile" class="avatar-img" />
	</div>
{:else}
	<div class="avatar">
		<img src={imageSrc} alt="profile" class="avatar-img" />
		<div class="avatar-content">
			<span
				class="avatar-text"
				on:click={() => {
					fileinput.click();
				}}>Edit avatar</span
			>
		</div>
		<input
			style="display:none"
			type="file"
			accept=".jpg, .jpeg, .png"
			on:change={(e) => onFileSelected(e)}
			bind:this={fileinput}
		/>
	</div>
{/if}

<style>
	* {
		margin: 0;
		padding: 0;
		font-family: sans-serif;
		width: 100%;
	}

	.avatar {
		position: relative;
		width: 125px;
		height: 125px;
		border-radius: 50%;
		overflow: hidden;
		background-color: grey;
	}

	.avatar:hover .avatar-content {
		opacity: 1;
	}

	.avatar:hover .avatar-img {
		opacity: 0.5;
	}

	.avatar-img {
		object-fit: cover;
		opacity: 1;
		transition: opacity 0.2s ease-in-out;
		height: 125px;
		width: 125px;
	}

	.avatar-content {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: white;
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
	}

	.avatar-text {
		text-transform: uppercase;
		font-size: 12px;
		width: 50%;
		text-align: center;
	}
</style>
