<script lang="ts">
	import { get } from "svelte/store";
	import { BACKEND_URL, user, myavatar } from "../../stores/store";
	import { getCookie } from "../../stores/auth";
	import { onMount } from "svelte";
	import Avatar from "../Avatar.svelte";

	// default paths
	const default_imageSrc = "static/default_avatar.png";
	const loading_imageSrc = "static/loading_icon.gif";
	let imageSrc = undefined;

	// avatar upload
	let fileinput: any;
	const onFileSelected = async (e) => {
		let image = e.target.files[0];
		if (image === undefined) // cancel button
			return ; 
		let data = new FormData();
		data.append("file", image);

		const resp = await fetch(get(BACKEND_URL) + "/users/upload_avatar", {
			method: "POST",
			body: data,
			headers: { Authorization: "Bearer " + getCookie("jwt") },
		});
		if (resp.ok) {
			const img_id = await resp.json();
			$myavatar = get(BACKEND_URL) + "/users/image/" + img_id;
		} else {
			alert(
				"Upload failed!\nMake sure the uploaded file size is less then 2MB, and that the format is jpeg, jpg, or png."
			);
		}
	};

	onMount(async () => {});
</script>

<div class="avatar">
	<Avatar nickname={$user.nickname} size="125" personal={true} />
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

	.avatar:hover {
		opacity: 0.5;
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
		color: black;
		font-weight: bold;
	}
</style>
