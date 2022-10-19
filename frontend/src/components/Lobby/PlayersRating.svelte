<script lang="ts">
	import {onMount} from "svelte";
	import {get_top_10} from "../../auth";

	let stats: any = undefined;
	onMount(async () => {
		stats = await get_top_10();
	});

</script>

<main>
    <h3 class="mb-3">Rating: </h3>
    {#if stats === undefined}
        <p>Loading...</p>
    {:else }
        {#each stats as stat}
            <ul class="list-group list-group-horizontal">
                <li class="list-group-item ">{stat.rating}</li>
                <li class="list-group-item ">{stat.nickname}</li>
            </ul>
        {/each}
    {/if}
</main>