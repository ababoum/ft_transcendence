<script lang="ts">
	import Header from "../components/Nav.svelte";
	import {show_nav} from "../stores/store";
</script>

<main>
	{#if $show_nav}
		<Header />
	{/if}
	<p> 404 page not found </p>
</main>