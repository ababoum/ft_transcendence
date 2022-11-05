<script lang="ts">
	import { onMount } from "svelte";
	import {
		disable_2fa,
		update_email,
		update_nickname,
		update_password,
		validate_2fa_code,
	} from "../../stores/requests";
	import Modal, { getModal } from "./Modal.svelte";
	import QrCode from "./QR_Code.svelte";

	export let profile_data;
	let profile = undefined;
	let updating_email = false;
	let updating_nickname = false;
	let updating_password = false;
	let TwoFA_QRCode: string;
	$: profile = profile_data;

	onMount(async () => {});

	function focus_on_element(elem: any) {
		elem.focus();
	}

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

		window.location.reload();
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

		window.location.reload();
	}

	async function updatePassword(e) {
		// Get the data from the form
		const formData = new FormData(e.target);
		let old_password = "undefined";

		if (!profile.random_password)
			old_password = formData.get("old_password").toString();

		const new_password = formData.get("new_password").toString();
		const confirm_new_password = formData
			.get("confirm_new_password")
			.toString();

		if (new_password !== confirm_new_password) {
			alert(
				"The new password and its confirmation should correspond.\nPlease retry!"
			);
			return;
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

	async function disable2FA() {
		// send request to backend to disable 2FA for current user
		await disable_2fa();

		window.location.reload();
	}

	let twoFA_msg = ""; // to signal errors to the user
	async function enable2FA(e) {
		// send access code to backend to validate 2FA activation

		const formData = new FormData(e.target);
		const code = formData.get("code").toString();
		if (code.length != 6) {
			twoFA_msg = `<p class="text-danger">The access code should be 6-digit long</p>`;
			return;
		}

		if (parseInt(code) < 0) {
			twoFA_msg = `<p class="text-danger">The access code should be a positive integer</p>`;
			return;
		}
		twoFA_msg = await validate_2fa_code(code);
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
							use:focus_on_element
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
							use:focus_on_element
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

		<!-- RATING (CANNOT BE DIRECTLY MODIFIED) -->

		<div class="d-flex flex-column justify-content-center align-items-center">
			<div><strong>⭐ Rating ⭐</strong></div>
			<div class="rating-text">{profile.rating}</div>
		</div>

		<!-- PASSWORD MANAGEMENT -->

		<div>
			<strong>Do you want to change your password?</strong>
			<span class="update-btn" on:click={togglePassword}>⚙️</span>
		</div>
		{#if updating_password}
			<div class="form-container">
				<form on:submit|preventDefault={updatePassword}>
					<div class="form-group">
						{#if !profile.random_password}
							<input
								use:focus_on_element
								type="password"
								placeholder="Old password"
								id="old_password"
								name="old_password"
								required
							/>
						{/if}
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

		<!-- 2FA MANAGEMENT -->

		<div class="d-flex align-items-center">
			<strong>2FA Authentication:&nbsp;</strong>
			{profile.isTwoFAEnabled ? "Enabled ✅" : "Disabled ❌"}
			{#if profile.isTwoFAEnabled}
				<button
					type="button"
					class="btn btn-warning btn-sm update-btn"
					on:click={disable2FA}>Disable</button
				>
			{:else}
				<button
					type="button"
					class="btn btn-primary btn-sm update-btn"
					on:click={getModal("twofa").open}>Enable</button
				>
			{/if}
		</div>

		<!-- the pop-up for 2FA -->
		<Modal id="twofa">
			<h1 class="popup-msg">
				Download Google Authenticator: <a
					href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
					>for Android</a
				>
				and
				<a
					href="https://apps.apple.com/us/app/google-authenticator/id388497605"
					>for Apple</a
				>
			</h1>
			<p class="p-2">
				Scan the following QR Code with Google Authenticator App:
			</p>
			<div class="d-flex justify-content-center">
				<QrCode size="125" />
			</div>
			<p class="p-2">
				Then enter the 6-digit access code generated by the App:
			</p>
			<div
				class="d-flex flex-column justify-content-center align-content-center"
			>
				<div class="form-group">
					<form on:submit|preventDefault={enable2FA}>
						<div class="input-group">
							<input
								name="code"
								type="number"
								placeholder="Your access code"
							/>
						</div>
						<div class="input-group">
							<button type="submit" class="btn btn-dark mx-2"
								>Submit</button
							>
						</div>
					</form>
				</div>
				{#if twoFA_msg}
					{@html twoFA_msg}
				{/if}
			</div>
		</Modal>
	</div>

	<hr />

	<!-- Friends list -->

	<div />
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
		margin: 0 5px;
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

	.popup-msg {
		font-size: min(max(16px, 4vw), 22px);
	}

	.rating-text {
		color: rgb(255, 183, 0);
		font-size: 200%;
		font-weight: bold;
		text-shadow: 1px 1px #392308;
	}
</style>
