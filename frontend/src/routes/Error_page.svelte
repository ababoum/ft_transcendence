<script lang="ts">
    import Header from "../components/Nav.svelte";
    import {link, push} from "svelte-spa-router";
    import {onMount} from "svelte";
    import {is_authenticated} from "../stores";

    let tmp: boolean;
    onMount(async () => { tmp = await is_authenticated(); });
    $: is_logged = tmp;
    $: if (!is_logged)
        push('/log');
</script>

<main>
    <Header/>
    <p> 404 page not found </p>
</main>