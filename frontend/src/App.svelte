<script lang="ts">
	import Router from "svelte-spa-router";
	import { routes } from "./routes";
	import { Modal } from "svelte-simple-modal";
	import GlobalModalService from "./components/GlobalModal/GlobalModalService.svelte";
</script>

<main>
	<Modal>
		<GlobalModalService />
	</Modal>
	<Router {routes} />
</main>
