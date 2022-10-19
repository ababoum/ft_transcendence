<script lang="ts">
	import {push} from "svelte-spa-router";
	import {CREATE_ACC_URL, LOGIN_PAGE, LOGIN_URL} from "../stores";
	import {onMount} from "svelte";
	import {is_authenticated, setCookie} from "../auth";

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
								<div class="mb-md-5 mt-md-4 pb-5">

									<h2 class="fw-bold mb-2 text-uppercase">{is_login ? "Login" : "Registration"} </h2>
									<p class="text-white-50 mb-5">Please enter your login{!is_login ? ", email" : ""}
										and password!</p>

									<div class="form-outline form-white mb-4">
										<input type="text" id="typeTextX" class="form-control form-control-lg"
											   required bind:value={login}/>
										<label class="form-label" for="typeTextX">User name</label>
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


									<div class="d-flex justify-content-center text-center mt-4 pt-1">
										<a href="#!" class="text-white"><i class="fab fa-facebook-f fa-lg"></i></a>
										<a href="#!" class="text-white"><i
												class="fab fa-twitter fa-lg mx-4 px-2"></i></a>
										<a href="#!" class="text-white"><i class="fab fa-google fa-lg"></i></a>
									</div>

								</div>
							</form>

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