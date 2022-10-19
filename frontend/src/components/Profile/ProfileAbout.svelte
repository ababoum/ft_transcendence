<script lang="ts">
    import { onMount } from "svelte";
	import type { loginBase } from "../../types";

	export let loginPayload: loginBase;

	$: data = loginPayload;
	onMount(() => {
		console.log(loginPayload);
		loginPayload = loginPayload;
	});

</script>

<div class="profile-about">
	<div class="profile-about-name">Robert</div>
	<div class="profile-about-job">Software Engineer</div>
</div>

<style>
	.profile-about {
		text-align: center;
		margin: 10px;
	}

	.profile-about-name {
		font-weight: bold;
	}

	.profile-about-job {
		text-align: center;
	}
</style>
