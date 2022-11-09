<script lang="ts">
	import { onMount } from "svelte";
	import { get_matches } from "../../stores/requests";

	export let profile_data;
	let profile = undefined;
	$: profile = profile_data;

	let wins: number = 0;
	let losses: number = 0;
	let matches;

	onMount(async () => {
		matches = await get_matches(profile.login);
		wins = matches.filter((match) => match.winnerLogin === profile.login).length;
		losses = matches.filter((match) => match.loserLogin === profile.login).length;
	});
</script>

<div class="d-flex flex-column justify-content-center align-items-center">
	<div><strong>⭐ Rating ⭐</strong></div>
	<div class="rating-text">{profile.rating}</div>
	<div class="d-flex flex-row">
		<div
			class="d-flex flex-column justify-content-center align-items-center mx-2"
		>
			<div><strong>Wins</strong></div>
			<div class="score-text">{wins}</div>
		</div>
		<div
			class="d-flex flex-column justify-content-center align-items-center mx-2"
		>
			<div><strong>Losses</strong></div>
			<div class="score-text">{losses}</div>
		</div>
	</div>
</div>

<style>
	.rating-text {
		color: rgb(255, 183, 0);
		font-size: 200%;
		font-weight: bold;
		text-shadow: 1px 1px #392308;
	}

	.score-text {
		color: rgb(47, 45, 40);
		font-size: 200%;
		font-weight: bold;
		text-shadow: 1px 1px #392308;
	}
</style>
