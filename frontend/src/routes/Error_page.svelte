<script lang="ts">
	import Header from "../components/Nav.svelte";
	import {show_nav} from "../stores/store";
</script>

<main>
	{#if $show_nav}
		<Header />
	{/if}
	<div class="mt-5">
		<p style="font-size: 60px; text-align: center"> 404 page not found </p>
	</div>
</main>

