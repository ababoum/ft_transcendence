<script lang="ts">
	import TwoFa_42 from "../components/Login/TwoFA_42.svelte";

	const urlParams = new URLSearchParams(window.location.search);
	const login = urlParams.get('login');
</script>

<main>
	<TwoFa_42 login={login}/>
</main>

