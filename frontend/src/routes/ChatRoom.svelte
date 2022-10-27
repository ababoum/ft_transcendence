<script lang="ts">
	import Header from "../components/Nav.svelte";
	import {push} from "svelte-spa-router";
	import {onDestroy, onMount} from "svelte";
	import {get_current_user_data, is_authenticated} from "../stores/requests";
	import {chatroom_socket, user} from "../stores/store";
	import {getCookie} from "../stores/auth";
    import { get } from "svelte/store";
    import { io } from "socket.io-client";
    import { fix_and_destroy_block, xlink_attr } from "svelte/internal";

	let tmp: boolean;
	let chatRoomsList = [];
	let messagesList = [];
	let activeChatRoomId;

	onMount(async () => { 
		tmp = await is_authenticated();
		$user = await $user.upd()
		await getChatRoomsList();

		$chatroom_socket.on('chatrooms-list', (data) => {
			chatRoomsList = data;
		});

		$chatroom_socket.on('message', (data) => {
			messagesList.push(data)
			messagesList = [...messagesList]
			console.log("Received message: " + data.content)
		})
	})

	let chatrooms_test = [{id: 1, name: "Chatroom1"}, {id: 2, name: "Chatroom2"}]

	let messages_test = [{nickname: "User1", content: "Hey !"}, 
					{nickname: "User2", content: "How are you ?"}, 
					{nickname: "User3", content: "Frontend sucks."}]

	onDestroy(() => {
	})

	async function getChatRoomsList() {
		chatRoomsList = await fetch('http://localhost:3000/chatrooms', {
			method: 'GET',
			headers: {"Authorization": "Bearer " + getCookie("jwt")}
		}).then(chatrooms => chatrooms.json())
	}

	async function createChatRoom(name: string, mode?: string, password?: string){
		const rawresponse = await fetch('http://localhost:3000/chatrooms', {
			method: 'POST',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({name: "nametest", mode: mode, password: password})
		})
		const res = await rawresponse.json()
		console.log(res)
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

	async function leaveChatRoom(chatRoomId: number){
		console.log("In leaveChatRoom " + chatRoomId)

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
	}

	async function postMessage(chatRoomId: number, message: string){
		console.log("In postMessage " + chatRoomId + " - message: " + message)

		const rawresponse = await fetch('http://localhost:3000/chatrooms/' + chatRoomId + '/messages', {
			method: 'POST',
			headers: {	
				"Authorization": "Bearer " + getCookie("jwt"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({content: message})
		})
		const res = await rawresponse.json()
		console.log("Successfully posted message: " + res.content)
	}

</script>

<main>
	<Header/>
<section style="background-color: black;">
  <div class="container py-5">

    <div class="row">
      <div class="col-md-12">

        <div class="card" id="chat3" style="border-radius: 15px;">
          <div class="card-body">

            <div class="row">
              <div class="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">

                <div class="p-3">
					
					
                  <div data-mdb-perfect-scrollbar="true" style="position: relative; height: 400px">
					{#if chatRoomsList[0] }
					<ul class="list-unstyled mb-0">
						{#each chatRoomsList as chatroom}
						  <li class="p-2 border-bottom">
							<div class="pt-1">
							  {#if chatroom.participants.find(x => x.login === $user.login) !== undefined}
							  <p>{chatroom.name} 
								<button on:click={() => enterChatRoom(chatroom.id)}>Enter</button>
								<button on:click={() => leaveChatRoom(chatroom.id)}>Leave</button> 
							  </p>
							  {:else if chatroom.banList.find(x => x.login === $user.login)}
							  <p>{chatroom.name} <button>Banned</button> </p>
							  {:else}
							  <p>{chatroom.name} <button on:click={() => joinChatRoom(chatroom.id)}>Join</button> </p>
							  {/if}
							</div>
						  </li>
						{/each}
						</ul>
					{:else}
	                    <ul class="list-unstyled mb-0">
						{#each chatrooms_test as chatroom_test}
	                      <li class="p-2 border-bottom">
	                        <div class="pt-1">
	                          <p>{chatroom_test.name} <button>Enter</button> </p>
	                        </div>
	                      </li>
						{/each}
	                    </ul>
					{/if}
                  </div>
				  <button class="create" on:click={() => createChatRoom("test")}>Create new room</button>


                </div>

              </div>

		          <div class="col-md-6 col-lg-7 col-xl-8">

		            <div class="pt-3 pe-3" data-mdb-perfect-scrollbar="true"
		              style="position: relative; height: 400px">
					  {#each messagesList as message}

		              <div class="d-flex flex-row justify-content-start">
		                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
		                  alt="avatar 1" style="width: 45px; height: 100%;">
		                <div>
						  {#if message.author.nickname === $user.nickname}
		                  <p class="small p-2 ms-3 mb-1 rounded-3" style="background-color: blue;">{message.author.nickname}: {message.content}</p>
						  {:else} 
						  <p class="small p-2 ms-3 mb-1 rounded-3" style="background-color: green;">{message.author.nickname}: {message.content}</p>
						  {/if}
						  <p class="small ms-3 mb-3 rounded-3 text-muted">{message.creationDate}</p>
		                </div>
		              </div>

					  {/each}
					  {#if activeChatRoomId != undefined}
					  <button on:click={() => postMessage(activeChatRoomId, "test")}>Post</button>
					  {/if}
		            </div>

		            <div class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
		              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
		                alt="avatar 3" style="width: 40px; height: 100%;">
		              <input type="text" class="form-control form-control-lg" id="exampleFormControlInput2"
		                placeholder="Type message">
		            </div>

		          </div>
            </div>

          </div>
        </div>

      </div>
    </div>

  </div>
</section>
</main>