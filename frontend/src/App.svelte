<script lang="ts">
	import Router from "svelte-spa-router";
	import {routes} from "./routes";
	import {Modal} from "svelte-simple-modal";
	import Invitation from "./components/Game/Invitations/Invitation.svelte";
</script>

<main>
	<Modal>
		<Invitation/>
	</Modal>
	<Router {routes}/>
</main>