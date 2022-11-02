<script lang="ts">
	import Nav from "../Nav.svelte";
	import { signIn } from "../../stores/auth";
	import { user } from "../../stores/store";
	import { push } from "svelte-spa-router";

	let login: string;
	let password: string;
	let error: string;

	async function call_log() {
		error = undefined;
		await signIn(login, password).catch((e) => {
			error = e;
		});
		if (error === undefined) {
			$user = await $user.upd();
			await push("/");
		}
	}
</script>

<main>
	<form on:submit|preventDefault={call_log}>
		<div class="mb-	md-5 mt-md-4 pb-5">
			<h2 class="fw-bold mb-2 text-uppercase">Login</h2>
			<p class="text-white-50 mb-5">
				Please enter your login and password
			</p>
			<div class="form-outline form-white mb-4">
				<input
					type="text"
					id="typeTextX"
					class="form-control form-control-lg"
					required
					bind:value={login}
				/>
				<label class="form-label" for="typeTextX">Login</label>
			</div>
			<div class="form-outline form-white mb-4">
				<input
					type="password"
					id="typePasswordX"
					class="form-control form-control-lg"
					required
					bind:value={password}
				/>
				<label class="form-label" for="typePasswordX">Password</label>
			</div>

			{#if error !== undefined}
				<p style="color: red">{error}</p>
			{/if}

			<button class="btn btn-outline-light btn-lg px-5" type="submit">
				Login</button
			>
		</div>
	</form>
</main>
