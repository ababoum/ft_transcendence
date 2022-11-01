<script lang="ts">
	import { onMount } from "svelte";
    import { get_friends } from "../../stores/requests";
    import Avatar from "../Avatar.svelte";

	export let profile_data;
	let profile = undefined;
	$: profile = profile_data;


	let friends = [];

	onMount( async () => {
		friends = await get_friends(profile.login);
		console.log(friends);
	})

	async function deleteFriend(nickname: string) {
		// Send data to the API
		const resp = await delete_friend(nickname);

		console.log(resp);

		if (resp.ok) {
			msg = `<p class="text-success">User successfully added as friend</p>`;
		} else {
			msg = `<p class="text-danger">${await resp
				.json()
				.then((data) => data.message)}</p>`;
		}
	}

</script>

<div class="container">
	<div class="row d-flex justify-content-center">
		<div class="col-md-8">
			<div class="people-nearby">
			{#each friends as {nickname, status, login}}
				<div class="nearby-user">
					<div class="row d-flex align-items-center">
						<div class="col-md-2 col-sm-2">
							<Avatar
								size=100
								login={login}
							/>
						</div>
						<div class="col-md-7 col-sm-7">
							<h5>
								<span class="profile-link">{nickname}</span>
							</h5>
							<p><strong>Status: </strong>{status}</p>
						</div>
						<div class="col-md-3 col-sm-3">
							<button class="btn btn-primary pull-right">Invite to play</button>
							<button on:click={() => deleteFriend(nickname)} class="btn btn-danger pull-right">Delete</button>
						</div>
					</div>
				</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>

	.people-nearby .nearby-user {
		padding: 20px 0;
		border-top: 1px solid #f1f2f2;
		border-bottom: 1px solid #f1f2f2;
		margin-bottom: 20px;
	}
</style>
