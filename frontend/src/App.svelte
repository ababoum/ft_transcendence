<script lang="ts">
	import Router from "svelte-spa-router";
	import {routes} from "./routes";
	import { FRONTEND_URL, BACKEND_URL} from './domain.js'
</script>

<main>
	<Router {routes}/>
</main>