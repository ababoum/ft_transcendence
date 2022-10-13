<script lang="ts">
	import Header from "../components/Nav.svelte";
	import { link, push } from "svelte-spa-router";
	import { onMount } from "svelte";
	import { get_current_user_data } from "../stores";
	import type { loginBase } from "../types";

	let tmp: loginBase;
	onMount(async () => {
		tmp = await get_current_user_data();
	});
	$: is_logged = tmp.is_logged_in;
	$: if (!is_logged) push("/log");
</script>

<main>
	<Header />
	<p>404 page not found</p>
</main>
