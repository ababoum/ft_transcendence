<script lang="ts">
	import { onMount } from "svelte";
	import {
		update_email,
		update_nickname,
		update_password,
	} from "../../stores/requests";

	const profile_data = $$props;

	let profile = undefined;
	let updating_email = false;
	let updating_nickname = false;
	let updating_password = false;

	onMount(async () => {
		profile = profile_data;
	});

	async function updateEmail(e) {
		// Get the data from the form
		const formData = new FormData(e.target);
		const new_email = formData.get("new_email").toString();

		// Send data to the API
		const msg: string = await update_email(new_email);

		// if the request fails, send an alert
		if (msg != null) {
			alert(msg);
			return;
		}
		// close the 'prompt'
		updating_email = false;
	}

	async function updateNickname(e) {
		// Get the data from the form
		const formData = new FormData(e.target);
		const new_nickname = formData.get("new_nickname").toString();

		// Send data to the API
		const msg: string = await update_nickname(new_nickname);

		// if the request fails, send an alert
		if (msg != null) {
			alert(msg);
			return;
		}

		// close the 'prompt'
		updating_nickname = false;
	}

	async function updatePassword(e) {
		// Get the data from the form
		const formData = new FormData(e.target);
		const old_password = formData.get("old_password").toString();
		const new_password = formData.get("new_password").toString();
		const confirm_new_password = formData.get("confirm_new_password").toString();

		if (new_password !== confirm_new_password)
		{
			alert("The new password and its confirmation should correspond. Please retry!")
			return ;
		}
		// Send data to the API
		const msg: string = await update_password(old_password, new_password);

		// if the request fails, send an alert
		if (msg != null) {
			alert(msg);
			return;
		}

		// close the 'prompt'
		updating_password = false;
	}

	function toggleEmail() {
		updating_email = !updating_email;
	}
	function toggleNickname() {
		updating_nickname = !updating_nickname;
	}

	function togglePassword() {
		updating_password = !updating_password;
	}
</script>

{#if profile !== undefined}
	<div class="profile-about">
		<!-- LOGIN cannot be modified -->
		<div><strong>Login:</strong> {profile.login}</div>

		<!-- NICKNAME -->
		<div>
			<strong>Nickname:</strong>
			{profile.nickname}
			<span class="update-btn" on:click={toggleNickname}>⚙️</span>
		</div>
		{#if updating_nickname}
			<div class="form-container">
				<form on:submit|preventDefault={updateNickname}>
					<div class="form-group">
						<input
							type="text"
							id="new_nickname"
							name="new_nickname"
							placeholder="Your new nickname"
						/>
					</div>
					<div class="form-group">
						<button class="submit-btn" type="submit">💾</button>
					</div>
				</form>
			</div>
		{/if}

		<!-- EMAIL -->

		<div>
			<strong>Email:</strong>
			{profile.email}
			<span class="update-btn" on:click={toggleEmail}>⚙️</span>
		</div>
		{#if updating_email}
			<div class="form-container">
				<form on:submit|preventDefault={updateEmail}>
					<div class="form-group">
						<input
							type="text"
							id="new_email"
							name="new_email"
							placeholder="Your new email address"
						/>
					</div>
					<div class="form-group">
						<button class="submit-btn" type="submit">💾</button>
					</div>
				</form>
			</div>
		{/if}

		<!-- PASSWORD MANAGEMENT -->

		<div>
			<strong>Do you want to change your password?</strong>
			<span class="update-btn" on:click={togglePassword}>⚙️</span>
		</div>
		{#if updating_password}
			<div class="form-container">
				<form on:submit|preventDefault={updatePassword}>
					<div class="form-group">
						<input
							type="password"
							placeholder="Old password"
							id="old_password"
							name="old_password"
							required
						/>
						<input
							type="password"
							placeholder="New password"
							id="password"
							name="new_password"
							required
						/>
						<input
							type="password"
							placeholder="Confirm new password"
							id="confirm_password"
							name="confirm_new_password"
							required
						/>
					</div>
					<div class="form-group">
						<button class="submit-btn" type="submit">💾</button>
					</div>
				</form>
			</div>
		{/if}
	</div>
{:else}
	<div>Loading...</div>
{/if}

<style>
	* {
		margin: 0px;
		padding: 0px;
	}

	.profile-about {
		text-align: left;
		margin: 10px;
	}

	.update-btn {
		cursor: pointer;
	}

	.form-container {
		width: 100%;
		margin: 10px auto;
	}

	form {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
	}

	.form-group {
		margin: 10px;
		width: auto;
	}

	.form-group input[type="text"] {
		padding: 10px;
	}

	.submit-btn {
		background-color: transparent;
		background-repeat: no-repeat;
		border: none;
		cursor: pointer;
		overflow: hidden;
		outline: none;
	}
</style>
