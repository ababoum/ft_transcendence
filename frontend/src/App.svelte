<script lang="ts">
	import User from "./User.ts";
	import Router from "svelte-spa-router";
	import {routes} from "./routes";

	import { user } from "./stores";
</script>

<main>
	<Router {routes}/>
</main>