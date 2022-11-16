<script lang="ts">
	import { onMount } from "svelte";
	import { get_matches } from "../../stores/requests";

	export let nickname_to_display: string;

	let matches = [];

	$: get_matches(nickname_to_display).then((resp) => {
		matches = resp;
	});

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
		const hour = ('0' + date.getHours()).slice(-2);
		const min = ('0' + date.getMinutes()).slice(-2);

		const formatted = `${dayName}, ${dayNum} ${monthName} ${year} at ${hour}:${min}`;
		return formatted;
	}

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
				{#if nickname_to_display == match.winner.nickname}
					<tr class="win">
						<th scope="row">🏆 {convert_date(match.createdAt)}</th>
						<td>{match.loser.nickname}</td>
						<td>{match.winnerScore}</td>
						<td>{match.loserScore}</td>
					</tr>
				{:else}
					<tr class="lose">
						<th scope="row">😥 {convert_date(match.createdAt)}</th>
						<td>{match.winner.nickname}</td>
						<td>{match.loserScore}</td>
						<td>{match.winnerScore}</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-header {
		background-color: rgb(163, 168, 173);
	}

	.win {
		background-color: rgb(125, 174, 125);
	}

	.lose {
		background-color: rgb(169, 103, 103);
	}
</style>
