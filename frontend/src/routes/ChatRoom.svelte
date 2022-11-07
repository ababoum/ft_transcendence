
<script lang="ts">
	import Header from "../components/Nav.svelte";
	import {push} from "svelte-spa-router";
	import {onDestroy, onMount} from "svelte";
	import {get_current_user_data, is_authenticated} from "../stores/requests";
	import {chatroom_socket, user, game_socket, nickname, show_nav} from "../stores/store";
	import {getCookie} from "../stores/auth";
    import { get } from "svelte/store";
    import { io } from "socket.io-client";
    import Modal, { getModal } from "../components/Profile/Modal.svelte";
    import CreateChatRoomForm from "../components/ChatRoom/CreateChatRoomForm.svelte";
    import Avatar from "../components/Avatar.svelte";


	let tmp: boolean;
	let chatRoomsList = [];
	let messagesList = [];
	let blockList = [];
	let activeChatRoomId;
	let adminNickname, banNickname, muteNickname, password: string;
	let muteDuration: number = 1
	let mutedUntil;
	let currentTime;
	let variable;

	onMount(async () => { 
		$user = await $user.upd()
		if (!$user.isLogged)
			await push("/login")
		else{
			await getChatRoomsList();
			await getBlockList();
		}

		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		$chatroom_socket.on('chatrooms-list', (data) => {
			console.log("Received chatrooms-list")
			chatRoomsList = data;
			console.log(chatRoomsList)
		});

		$chatroom_socket.on('message', (data) => {
			messagesList.push(data)
			messagesList = [...messagesList]
			console.log("Received message: " + data.content)
		})

		$chatroom_socket.on('you-have-been-banned', (data) => {
			console.log(data)
			if (data = activeChatRoomId){
				activeChatRoomId = undefined
				messagesList = []
			}
		});
	})

	onDestroy(() => {
	})

	async function getChatRoomsList() {
		chatRoomsList = await fetch('http://localhost:3000/chatrooms', {
			method: 'GET',
			headers: {"Authorization": "Bearer " + getCookie("jwt")}
		}).then(chatrooms => chatrooms.json())
		console.log(chatRoomsList)
	}

	async function getBlockList() {
		blockList = await fetch('http://localhost:3000/users/blockList', {
			method: 'GET',
			headers: {"Authorization": "Bearer " + getCookie("jwt")}
		}).then(blockList => blockList.json())
		console.log(blockList)
	}


	async function joinChatRoom(chatRoomId: number){
		console.log("In joinChatRoom " + chatRoomId)
		
		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + chatRoomId + '/join', {
			method: 'PATCH',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
			},
		})
		const res = await rawresponse.json()
		console.log(res)
	}

	async function joinProtectedChatRoom(e){
		const formData = new FormData(e.target);
		const chatRoomId = formData.get("chatroomId"); 
		const password = formData.get("password"); 
		console.log("In joinProtectedChatRoom: " + chatRoomId + " password: " + password)
		
		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + chatRoomId + '/joinProtected', {
			method: 'PATCH',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({password: password})
		})
		const res = await rawresponse.json()
		console.log(res)
		e.target.reset()
	}

	async function leaveChatRoom(chatRoomId: number){
		console.log("In leaveChatRoom " + chatRoomId)

		const test = await fetch('http://localhost:3000/chatrooms/' + activeChatRoomId + '/exit', {
			method: 'PATCH',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
			},
		})

		activeChatRoomId = undefined;

		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + chatRoomId + '/leave', {
			method: 'PATCH',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
			},
		})
		const res = await rawresponse.json()
		console.log(res)
		messagesList = []
		activeChatRoomId = undefined
	}

	async function enterChatRoom(chatRoomId: number){
		console.log("In enterChatRoom " + chatRoomId)

		const test = await fetch('http://localhost:3000/chatrooms/' + activeChatRoomId + '/exit', {
			method: 'PATCH',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
			},
		})

		activeChatRoomId = chatRoomId;

		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + chatRoomId + '/messages', {
			method: 'GET',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
			},
		})
		const res = await rawresponse.json()

		messagesList = res
		blockList = [...blockList]
	}

	async function banUser(chatRoomId: number, usernickname: string){
		console.log("In banUser " + usernickname + " room " + chatRoomId)
		if (usernickname === undefined)
			return alert("Please provide a nickname")

		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + chatRoomId + '/banUser', {
			method: 'PATCH',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({nickname: usernickname})
		})
		const res = await rawresponse.json()
		banNickname = undefined

		console.log(res)
		if (res.statusCode)
			alert("This user doesn't exist")	
	}

	async function unbanUser(chatRoomId: number, usernickname: string){
		console.log("In banUser " + usernickname + " room " + chatRoomId)
		if (usernickname === undefined)
			return alert("Please provide a nickname")

		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + chatRoomId + '/unbanUser', {
			method: 'PATCH',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({nickname: usernickname})
		})
		const res = await rawresponse.json()
		banNickname = undefined

		console.log(res)
		if (res.statusCode)
			alert("This user doesn't exist")	
	}

	async function adminUser(chatRoomId: number, usernickname: string){
		console.log("In adminUser " + usernickname + " room " + chatRoomId)
		if (usernickname === undefined)
			return alert("Please provide a nickname")

		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + chatRoomId + '/adminUser', {
			method: 'PATCH',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({nickname: usernickname})
		})
		const res = await rawresponse.json()
		adminNickname = undefined

		console.log(res)
		if (res.statusCode)
			alert("This user doesn't exist")	
	}

	async function unadminUser(chatRoomId: number, usernickname: string){
		console.log("In unadminUser " + usernickname + " room " + chatRoomId)
		if (usernickname === undefined)
			return alert("Please provide a nickname")

		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + chatRoomId + '/unadminUser', {
			method: 'PATCH',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({nickname: usernickname})
		})
		const res = await rawresponse.json()

		console.log(res)
		if (res.statusCode)
			alert("This user doesn't exist")	
	}

	async function muteUser(chatRoomId: number, usernickname: string, duration: number){
		console.log("In muteUser " + usernickname + " room " + chatRoomId)
		if (usernickname === undefined)
			return alert("Please provide a nickname")

		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + chatRoomId + '/muteUser', {
			method: 'PATCH',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({nickname: usernickname, duration: duration})
		})
		const res = await rawresponse.json()
		muteNickname = undefined

		console.log(res)
		if (res.statusCode)
			alert("This user doesn't exist")
	}

	async function unmuteUser(chatRoomId: number, usernickname: string){
		console.log("In unmuteUser " + usernickname + " room " + chatRoomId)
		if (usernickname === undefined)
			return alert("Please provide a nickname")

		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + chatRoomId + '/unmuteUser', {
			method: 'PATCH',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({nickname: usernickname})
		})
		const res = await rawresponse.json()
		muteNickname = undefined

		console.log(res)
		if (res.statusCode)
			alert("This user doesn't exist")
	}

	async function postMessageForm(e){
		const formData = new FormData(e.target);
		const message = formData.get("message");
		console.log("In postMessage " + activeChatRoomId + " - message: " + message)

		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + activeChatRoomId + '/messages', {
			method: 'POST',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({content: message})
		})
		const res = await rawresponse.json()
		console.log(res)

		e.target.reset()
	}

	async function inviteUser(e){
		const formData = new FormData(e.target);
		const nickname = formData.get("nickname");
		console.log("In inviteUser " + activeChatRoomId + " - nickname: " + nickname)

		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + activeChatRoomId + '/invite', {
			method: 'PATCH',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({nickname: nickname})
		})
		const res = await rawresponse.json()
		console.log(res)

		if(res.statusCode === 409)
			alert("This user doesn't exist")
		if(res.statusCode === 401)
			alert("This user is banned from this room")

		e.target.reset()
	}

	
	async function addPassword(chatRoomId: number, password: string){
		console.log("In addPassword " + password + " room " + chatRoomId)
		if (password === undefined)
			return alert("Please provide a password")

		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + chatRoomId + '/addPassword', {
			method: 'PATCH',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({password: password})
		})
		const res = await rawresponse.json()

		console.log(res)
	}

	async function changePassword(chatRoomId: number, password: string){
		console.log("In changePassword " + password + " room " + chatRoomId)
		if (password === undefined)
			return alert("Please provide a password")

		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + chatRoomId + '/changePassword', {
			method: 'PATCH',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({password: password})
		})
		const res = await rawresponse.json()

		console.log(res)
	}

	async function removePassword(chatRoomId: number){
		console.log("In removePassword " + chatRoomId + " chatRoomId")

		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + chatRoomId + '/removePassword', {
			method: 'PATCH',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
			},
		})
		const res = await rawresponse.json()

		console.log(res)
	}

	async function blockUser(nickname:string) {
		console.log("In blockUser " + nickname)
		if (nickname === undefined)
			return alert("Please provide a nickname")

		const rawresponse = await fetch('http://localhost:3000/users/blockUser/', {
			method: 'POST',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({nickname: nickname})
		})
		const res = await rawresponse.json()

		if(res.statusCode === 409)
			alert("You can't block yourself")
		else if (res.statusCode)
			alert("Can't block this user")
		else
			blockList = res

		console.log(blockList)
	}

	async function unblockUser(nickname:string) {
		console.log("In blockUser " + nickname)
		if (nickname === undefined)
			return alert("Please provide a nickname")

		const rawresponse = await fetch('http://localhost:3000/users/unblockUser/', {
			method: 'DELETE',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({nickname: nickname})
		})
		const res = await rawresponse.json()

		if(res.statusCode === 409)
			alert("You can't unblock yourself")
		else if (res.statusCode)
			alert("Can't unblock this user")
		else
			blockList = res

		console.log(blockList)
	}

	async function findGame(login: string) {
		$game_socket.emit('game-invite', login);
	}

</script>

<main>
	{#if $show_nav}
		<Header/>
	{/if}

<section style="background-color: black;">
  <div class="container py-5">

    <div class="row">
      <div class="col-md-12">

        <div class="card" id="chat3" style="border-radius: 15px;">
          <div class="card-body">

            <div class="row">

              <div class="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">

                <div class="p-3">
					
					<div class="overflow-auto" style="position: relative; height: 300px; width:auto; overflow-y: scroll">
					{#key chatRoomsList}
					<ul class="list-unstyled mb-0">
						{#each chatRoomsList as chatroom (chatroom)}
							{#if chatroom.mode === "PUBLIC"}
							<div class="pt-1">
							  {#if chatroom.participants.find(x => x.nickname === $user.nickname) !== undefined}
							  <p style="width: 50%; display:inline-block">{chatroom.name}</p>
							  <button class="btn btn-primary" on:click={() => enterChatRoom(chatroom.id)}>Enter</button>
							  <button class="btn btn-secondary" on:click={() => leaveChatRoom(chatroom.id)}>Leave</button> 
							  {:else if chatroom.banList.find(x => x.nickname === $user.nickname) !== undefined}
							  <p style="width: 50%; display:inline-block">{chatroom.name}</p>
							  <button class="btn btn-primary">Banned</button>
							  {:else}
							  <p style="width: 50%; display:inline-block">{chatroom.name}</p>
							  <button class="btn btn-primary" on:click={() => joinChatRoom(chatroom.id)}>Join</button>
							  {/if}
							</div>
							{:else if chatroom.mode === "PROTECTED"}
							<div class="pt-1">
								{#if chatroom.participants.find(x => x.nickname === $user.nickname) !== undefined}
								<p style="width: 50%; display:inline-block">{chatroom.name}</p>
								<button class="btn btn-primary" on:click={() => enterChatRoom(chatroom.id)}>Enter</button>
								<button class="btn btn-secondary" on:click={() => leaveChatRoom(chatroom.id)}>Leave</button> 
								{:else if chatroom.banList.find(x => x.nickname === $user.nickname) !== undefined}
								<p style="width: 50%; display:inline-block">{chatroom.name}</p>
								<button class="btn btn-primary">Banned</button>
								{:else}
								<form on:submit|preventDefault={joinProtectedChatRoom}>
									<label>{chatroom.name} <input type="text" name="password" minlength="3" placeholder="password" style=" position: relative; width:100px" required/>
										<input type="hidden" name="chatroomId" value={chatroom.id}/>
									</label>
								</form>
								{/if}
							</div>
							{:else if chatroom.mode === "PRIVATE"}
							{#if chatroom.participants.find(x => x.nickname === $user.nickname) !== undefined}
							<div class="pt-1">
								<p style="width: 50%; display:inline-block">{chatroom.name}</p>
								<button class="btn btn-primary" on:click={() => enterChatRoom(chatroom.id)}>Enter</button>
								<button class="btn btn-secondary" on:click={() => leaveChatRoom(chatroom.id)}>Leave</button> 
							</div>
							{/if}
							{/if}
						{/each}
						</ul>
					{/key}
                  </div>
				  <button type="button" class="btn btn-primary btn-sm update-btn" on:click={getModal().open}>Create Room Form</button>
				  <div class="overflow-auto" style="position: relative; height: 300px; width:auto; overflow-y: scroll">
					<p>Private Messages List</p>
					<p>Private Messages List</p>
					<p>Private Messages List</p>
					<p>Private Messages List</p>
					<p>Private Messages List</p>
					<p>Private Messages List</p>
					<p>Private Messages List</p>
					<p>Private Messages List</p>
					<p>Private Messages List</p>
				  </div>

                </div>

              </div>

		          <div class="col-md-6 col-lg-7 col-xl-8">
		            <div class="overflow-auto t-3 pe-3" style="position: relative; height: 400px; overflow-y: scroll">
					  {#each messagesList as message}

		              <div class="d-flex flex-row justify-content-start" style="width: 60%">
						<Avatar classes="rounded-circle" size="45" login="{"string"}"/>
						<div>
							<div class="dropdown">
								<span class="dropdown-toggle mall ms-3 mb-3 rounded-3 text-muted" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="width: auto;height: 5px">
									{message.author.nickname}
								</span>
								<span class="small ms-3 mb-3 rounded-3 text-muted" style="width: auto;height: 5px">{new Date(message.creationDate).toLocaleTimeString("en-US")}</span>
								<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								  <p class="dropdown-item">Profile</p>
								  {#if message.author.nickname != $user.nickname}
								  <p class="dropdown-item" on:click={() => findGame("string1")}>Game</p>
								  <p class="dropdown-item" on:click={() => blockUser(message.author.nickname)}>Block</p>
								  <p class="dropdown-item" on:click={() => unblockUser(message.author.nickname)}>Unblock</p>
								  {/if}
								</div>
							</div>
		                <div>
						  {#if message.author.nickname === $user.nickname}
		                  <p class="small p-2 ms-3 mb-1 rounded-3 text-break" style="background-color: blue; height: auto">{message.content}</p>
						  {:else if blockList.find(x => x.nickname === message.author.nickname) !== undefined} 
						  <p class="small p-2 ms-3 mb-1 rounded-3 text-break" style="background-color: grey; height: auto">Hidden message</p>
						  {:else}
						  <p class="small p-2 ms-3 mb-1 rounded-3 text-break" style="background-color: green; height: auto">{message.content}</p>
						  {/if}
		                </div>
						</div>
					  </div>
					  {/each}
		            </div>

					{#if activeChatRoomId != undefined}
					<div class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
						<Avatar classes="rounded-circle" size="45" login="{"string"}"/>
						{#key activeChatRoomId}
						{#if mutedUntil = chatRoomsList[activeChatRoomId - 1].muteList.find(x => x.user.nickname === $user.nickname)}
							{#if new Date(mutedUntil.mutedUntil) > currentTime}
							<p>You are muted until {new Date(mutedUntil.mutedUntil).toLocaleTimeString("en-US")}, the current time is {currentTime.toLocaleTimeString("en-US")}</p>
							{:else}
							<form on:submit|preventDefault|stopPropagation={postMessageForm}>
							<input name="message" type="text" minlength="1" maxlength="150" size="50" class="form-control form-control-lg" placeholder="Type here" required/>
							</form>
							{/if}
						{:else}
							<form on:submit|preventDefault|stopPropagation={postMessageForm}>
							<input name="message" type="text" minlength="1" maxlength="150" size="50" class="form-control form-control-lg" placeholder="Type here" required/>
							</form>
						{/if}
						{/key}
					</div>
					<div>
						<ul>
							{#if chatRoomsList[activeChatRoomId - 1].admin.find(x => x.nickname === $user.nickname) !== undefined}
							<div class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
								<form on:submit|preventDefault|stopPropagation={inviteUser} style="width: 100%;">
									<div class="input-group" style="width: 60%;">
									<input type="text" name="nickname" minlength="1" maxlength="150" class="form-control" placeholder="nickname" required>
									<span class="input-group-btn">
										<button type="submit" class="btn btn-info">Invite</button>
									</span>
									</div>
								</form>
							</div>
							{/if}
							{#if chatRoomsList[activeChatRoomId - 1].ownerNickname === $user.nickname}
							<div class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
								<input type="text" class="form-control" placeholder="nickname" bind:value={adminNickname} style="width: 50%">
								<button class="btn btn-success" on:click={() => adminUser(activeChatRoomId, adminNickname)}>Admin</button>
								<button class="btn btn-danger" on:click={() => unadminUser(activeChatRoomId, adminNickname)}>Unadmin</button>
							</div>
							<div class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
								{#if chatRoomsList[activeChatRoomId - 1].mode === "PUBLIC"}
								<input type="text" class="form-control" placeholder="password" bind:value={password} style="width: 50%">
								<button class="btn btn-success" on:click={() => addPassword(activeChatRoomId, password)}>Add</button>
								{:else if chatRoomsList[activeChatRoomId - 1].mode === "PROTECTED"}
								<input type="text" class="form-control" placeholder="password" bind:value={password} style="width: 50%">
								<button class="btn btn-info" on:click={() => changePassword(activeChatRoomId, password)}>Change</button>
								<button class="btn btn-danger" on:click={() => removePassword(activeChatRoomId)}>Remove</button>
								{/if}
							</div>
							{/if}
							{#if chatRoomsList[activeChatRoomId - 1].admin.find(x => x.nickname === $user.nickname) !== undefined}
							<div class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
								<input type="text" class="form-control" placeholder="nickname" bind:value={banNickname} style="width: 50%">
								<button class="btn btn-success" on:click={() => banUser(activeChatRoomId, banNickname)}>Ban</button>
								<button class="btn btn-danger" on:click={() => unbanUser(activeChatRoomId, banNickname)}>Unban</button>
							</div>
							<div class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
								<input type="text" class="form-control" placeholder="nickname" bind:value={muteNickname} style="width: 50%">
								<input type="range" min="1" max="60" bind:value={muteDuration}>
								<button class="btn btn-success" on:click={() => muteUser(activeChatRoomId, muteNickname, muteDuration)}>Mute {muteDuration}s </button>
								<button class="btn btn-danger" on:click={() => unmuteUser(activeChatRoomId, muteNickname)}>Unmute</button>
							</div>
							{/if}
						</ul>
					</div>
					{/if}

		          </div>

            </div>

          </div>
        </div>

      </div>
    </div>

  </div>
</section>
</main>

<Modal>
	<CreateChatRoomForm/>
</Modal>
