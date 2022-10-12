<script lang="ts">
    import {PROFILE_URL, GAME_URL, LOBBY_URL, LOGIN_URL} from "../stores";
    import { is_authenticated, eraseCookie } from "../stores";
    import {onMount} from "svelte";
    import {push} from "svelte-spa-router";

    let tmp: boolean;
    onMount(async () => { tmp = await is_authenticated(); });
    $: is_logged = tmp;

    async function logout() {
        eraseCookie("jwt");
        push('/log');
    }
</script>

<main>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <img src="/logo.png" alt="" width="40" height="30">
                TRANSCENDENCE
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href={$PROFILE_URL}>Profile</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href={$GAME_URL}>GAME</a>
                    </li>
                    {#if !is_logged}
                        <li class="nav-item">
                            <a class="nav-link" href="{$LOGIN_URL}">Login</a>
                        </li>
                    {:else}
                        <li class="nav-item">
                            <a class="nav-link" on:click={logout} href="{$LOGIN_URL}">Logout</a>
                        </li>
                    {/if}
                </ul>
            </div>
        </div>
    </nav>
    <br><br>
</main>