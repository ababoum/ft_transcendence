<script>
    import { getCookie } from "../../stores/auth";
    import { BACKEND_URL } from "../../stores/store";
	import { get } from "svelte/store";

	let name;
	let mode = "PUBLIC";
	let password = undefined;

	async function createChatRoomForm(e){
		const formData = new FormData(e.target);
		console.log("createChatRoomForm " + name + " " + mode + " " + password)

		const rawresponse = await fetch(get(BACKEND_URL) + '/chatrooms', {
			method: 'POST',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({name: name, mode: mode, password: password})
		})
		const res = await rawresponse.json()
		console.log(res)
		name = undefined
		mode = "PUBLIC"
		password = undefined

		if (res.statusCode === 400) {alert(res.message[0])}
	}
</script>

<form on:submit|preventDefault={createChatRoomForm}>
	<label>
		Name: <input type="text" placeholder="name" minlength="1" maxlength="100" bind:value={name} required>
	</label>
	<fieldset>
		<label>Select mode:	
		  <label><input type="radio" value="PUBLIC" bind:group={mode}> PUBLIC </label>	
		  <label><input type="radio" value="PRIVATE" bind:group={mode}> PRIVATE </label>	
		  <label><input type="radio" value="PROTECTED" bind:group={mode}> PROTECTED </label>
		</label>
	</fieldset>
	{#if mode === "PROTECTED"}
	<label>
		Password: <input type="text" placeholder="password" bind:value={password} minlength="3" maxlength="100" required>
	</label>
	{/if}
	<div>	
		<button type="submit">Submit</button>
	</div>
</form>