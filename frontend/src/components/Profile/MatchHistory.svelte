<script lang="ts">
	import { onMount } from "svelte";
	import { get_matches } from "../../stores/requests";
	import Avatar from "../Avatar.svelte";

	export let profile_data;
	let profile = undefined;
	$: profile = profile_data;

	let matches = [];
	let msg = "";

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	function convert_date(param: any) {
		let date = new Date(param);
		const dayName = days[date.getDay()];
		const dayNum = date.getDay();
		const monthName = months[date.getMonth()];
		const year = date.getFullYear();
		const hour = date.getHours();
		const min = date.getMinutes();

		const formatted = `${dayName}, ${dayNum} ${monthName} ${year} at ${hour}:${min}`;
		return formatted;
	}

	onMount(async () => {
		matches = await get_matches(profile.login);
		console.log(matches);
	});
</script>

<div class="p-4 w-100">
	<table class="table table-hover">
		<thead class="table-header">
			<tr>
				<th scope="col">Date</th>
				<th scope="col">Opponent</th>
				<th scope="col">My score</th>
				<th scope="col">Their score</th>
			</tr>
		</thead>
		<tbody>
			{#each matches as match}
				<tr>
					<th scope="row">{convert_date(match.createdAt)}</th>
					{#if profile.login == match.winnerLogin}
						<td>{match.loser.nickname}</td>
						<td>{match.winnerScore}</td>
						<td>{match.loserScore}</td>
					{:else}
						<td>{match.winner.nickname}</td>
						<td>{match.loserScore}</td>
						<td>{match.winnerScore}</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-header {
		background-color: rgb(163, 168, 173);
	}
</style>
