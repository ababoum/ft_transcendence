<script lang="ts">
	import { push, location } from "svelte-spa-router";
	import {show_nav, user} from "../stores/store";
	import { onMount } from "svelte";
	import SignIn from "../components/Login/SignIn.svelte";
	import SignUp from "../components/Login/SignUp.svelte";
	import Nav from "../components/Nav.svelte";
	import Auth42 from "../components/Login/Auth42.svelte";

	let is_log: boolean = true;
	onMount(async () => {
		try { $user = await $user.upd(); } 
		catch (e) { console.log("Backend unavailable") }
		if ($user.isLogged) await push("/");
	});
</script>

<main>
	{#if $show_nav}
		<Nav />
	{/if}
	<section class="vh-100 gradient-custom page-body">
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
							{#if is_log}
								<SignIn />
							{:else}
								<SignUp />
							{/if}
							<Auth42 />
							<div
								class="h-100 d-flex align-items-center justify-content-center"
							>
								<p class="mb-0">
									{is_log ? "Don't" : "Already"} have an account?
									<a
										class="text-white-50 fw-bold"
										href={$location === "/log"
											? "/#/log"
											: "/#/login"}
										on:click={() => (is_log = !is_log)}
										>Sign
										{is_log ? "In" : "Up"}</a
									>
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
	.page-body {
		padding-top: 56px;
		/* avoid collision with navbar */
	}
</style>
