<script lang="ts">
    import Header from "../components/Nav.svelte";
    import {link, push} from "svelte-spa-router";
    import {is_authenticated} from "../stores";
    import {onMount} from "svelte";

    let tmp: boolean;
    onMount(async () => { tmp = await is_authenticated(); });
    $: is_logged = tmp;

</script>

<main>
    <Header/>
</main>