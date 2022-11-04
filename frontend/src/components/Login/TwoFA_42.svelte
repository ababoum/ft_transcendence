<script lang="ts">
	import { authenticate_2fa_code } from "../../stores/requests";
	import { user } from "../../stores/store";
	import { push } from "svelte-spa-router";

	let access_code: string;
	export let login;

	let message: string = "";

	async function log_42_2FA() {
		const resp = await authenticate_2fa_code(login, access_code);

		if (resp.success) {
			$user = await $user.upd();
			await push("/");
		}
		else {
			message = resp.message;
		}
	}
</script>

<main>
	<section class="vh-100 gradient-custom">
		<div class="container py-5 h-100">
			<div
				class="row d-flex justify-content-center align-items-center h-100"
			>
				<div class="col-12 col-md-8 col-lg-6 col-xl-5">
					<div
						class="card bg-dark text-white"
						style="border-radius: 1rem;"
					>
						<div class="card-body p-5 text-center">
							<form on:submit|preventDefault={log_42_2FA}>
								<div class="mb-	md-5 mt-md-4 pb-5">
									<h2 class="fw-bold mb-2 text-uppercase">
										2FA validation
									</h2>
									<p class="text-white-50 mb-5">
										Please enter the access code generated
										by your Google Authenticator App
									</p>

									<div class="form-outline form-white mb-4">
										<input
											type="text"
											id="typeTextX"
											class="form-control form-control-lg"
											value={login}
											disabled
										/>
										<label
											class="form-label"
											for="typeTextX">Login</label
										>
									</div>

									<div class="form-outline form-white mb-4">
										<input
											type="text"
											id="typeTextX"
											class="form-control form-control-lg"
											placeholder="Your access code here"
											required
											bind:value={access_code}
										/>
										<label
											class="form-label"
											for="typeTextX">Access Code</label
										>
									</div>

									{#if message}
										{@html message}
									{/if}

									<button
										class="btn btn-outline-light btn-lg px-5"
										type="submit"
									>
										Send
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>
