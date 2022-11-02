<script lang="ts">
	import Nav from "../Nav.svelte";
	import {signUp} from "../../stores/auth";
	import {push, location} from "svelte-spa-router";

	let login: string;
	let password: string;
	let email: string;
	let nickname: string;

	let result: string = "";

	async function call_log() {
		result = "";
		result = await signUp(login, password, email, nickname);
		if (result == "") {
			if ($location === '/log')
			    await push('/login');
			else
				await push('/log');
		}
	}
</script>


<main>
    <form on:submit|preventDefault={call_log}>
        <div class="mb-	md-5 mt-md-4 pb-5">

            <h2 class="fw-bold mb-2 text-uppercase">Registration</h2>
            <p class="text-white-50 mb-5">Please enter your login, email, nickname and password</p>

            <div class="form-outline form-white mb-4">
                <input type="text" id="typeTextX" class="form-control form-control-lg"
                       required bind:value={login}/>
                <label class="form-label" for="typeTextX">Login</label>
            </div>
            <div class="form-outline form-white mb-4">
                <input type="text" id="typeNicknameX" class="form-control form-control-lg"
                       required bind:value={nickname}/>
                <label class="form-label" for="typeNicknameX">Nickname <i>(visible to the other users)</i></label>
            </div>
            <div class="form-outline form-white mb-4">
                <input type="email" id="typeEmailX" class="form-control form-control-lg"
                       required bind:value={email}/>
                <label class="form-label" for="typeEmailX">Email</label>
            </div>
            <div class="form-outline form-white mb-4">
                <input type="password" id="typePasswordX" class="form-control form-control-lg"
                       required bind:value={password}/>
                <label class="form-label" for="typePasswordX">Password</label>
            </div>

            {#if result !== undefined && result !== ""}
                <p style="color: red">{result}</p>
            {/if}

            <button class="btn btn-outline-light btn-lg px-5" type="submit">Register</button>
        </div>
    </form>
</main>