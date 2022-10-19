<script lang="ts">
	import {push} from "svelte-spa-router";
	import {BACKEND_URL, CREATE_ACC_URL, LOGIN_PAGE, LOGIN_URL} from "../stores";
	import {onMount} from "svelte";
	import {is_authenticated, setCookie} from "../auth";
    import { get } from "svelte/store";

	let login: string;
	let password: string;
	let email: string;
	let nickname: string;
	let result_msg: string;

	onMount(async () => { if (await is_authenticated()) await push('/')} );

	$: is_login = true;
	const submit = async () => {
		if (!is_login) {
			result_msg = "Account was successfully registered";
			await fetch($CREATE_ACC_URL, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({ login, password, email, nickname })
			}).catch((error) => { result_msg = "Can't register account: " + error; })
			if (result_msg == "Account was successfully registered")
				is_login = true;
		} else {
			let token;
			await fetch($LOGIN_URL, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({ login, password })
			}).then(response=>response.json())
					.then(data=>{ token = data['access_token']; })
			if (token != undefined) {
				setCookie("jwt", token);
				await push('/');
			} else
				result_msg = "Wrong login or password";
		}
	};

</script>

<main>
	<section class="vh-100 gradient-custom">
		<div class="container py-5 h-100">
			<div class="row d-flex justify-content-center align-items-center h-100">
				<div class="col-12 col-md-8 col-lg-6 col-xl-5">
					<div class="card bg-dark text-white" style="border-radius: 1rem;">
						<div class="card-body p-5 text-center">

							<form on:submit|preventDefault={submit}>
								<div class="mb-	md-5 mt-md-4 pb-5">

									<h2 class="fw-bold mb-2 text-uppercase">{is_login ? "Login" : "Registration"} </h2>
									<p class="text-white-50 mb-5">Please enter your login{!is_login ? ", email" : ""}
										and password</p>

									<div class="form-outline form-white mb-4">
										<input type="text" id="typeTextX" class="form-control form-control-lg"
											   required bind:value={login}/>
										<label class="form-label" for="typeTextX">Username</label>
									</div>
									{#if !is_login}
										<div class="form-outline form-white mb-4">
											<input type="text" id="typeNicknameX" class="form-control form-control-lg"
												   required bind:value={nickname}/>
											<label class="form-label" for="typeNicknameX">Nickname</label>
										</div>
										<div class="form-outline form-white mb-4">
											<input type="email" id="typeEmailX" class="form-control form-control-lg"
												   required bind:value={email}/>
											<label class="form-label" for="typeEmailX">Email</label>
										</div>
									{/if}

									<div class="form-outline form-white mb-4">
										<input type="password" id="typePasswordX" class="form-control form-control-lg"
											   required bind:value={password}/>
										<label class="form-label" for="typePasswordX">Password</label>
									</div>

									{#if result_msg !== undefined}
										<p>{result_msg}</p>
									{/if}

									<button class="btn btn-outline-light btn-lg px-5" type="submit">
										{is_login ? "Login" : "Register"} </button>

										
									</div>
								</form>
								
								
							<div style="margin-bottom: 1em">
								<a href={`${get(BACKEND_URL)}/auth/42/return`}>
									<button class="button is-dark is-large m-auto">
										<span>
											<img class="ft-icon" src="static/logo-42-square-reverse.png" alt="42">
										</span>
									Connect
									</button>
								</a>
							</div>
							<div>
								<p class="mb-0">{is_login ? "Don't h" : "H"}ave an account? <a
										class="text-white-50 fw-bold"
										href="/#/log"
										on:click={() => (is_login = !is_login)}>Sign {is_login ? "Up" : "In"} </a>
								</p>
							</div>

						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>

<style>

	.button {
		background-color: #fff;
		border-color: #dbdbdb;
		border-width: 1px;
		color: #363636;
		cursor: pointer;
		justify-content: center;
		padding: calc(.375em - 1px) .75em;
		text-align: center;
		white-space: nowrap;
	}
	
	.button.is-large {
		font-size: 1.5rem;
	}
	
	.button.is-dark {
		background-color: #363636;
		border-color: transparent;
		color: #f5f5f5;
		border-radius: 8px;
	}

	.m-auto {
		margin: auto !important;
	}

	.ft-icon {
		height: 1.5em;
		width: 1.5em;
	}

</style>	