<script lang="ts">
	import Header from "../components/Nav.svelte";
	import { push } from "svelte-spa-router";
	import { onDestroy, onMount } from "svelte";
	import { user, game_socket, BACKEND_URL, SOCKET_URL } from "../stores/store";
	import { getCookie } from "../stores/auth";
	import Modal, { getModal } from "../components/Profile/Modal.svelte";
	import CreateChatRoomForm from "../components/ChatRoom/CreateChatRoomForm.svelte";
	import Avatar from "../components/Avatar.svelte";
	import UserProfile from "../components/Profile/UserProfile.svelte";
	import { io, Socket } from "socket.io-client";
	import { xlink_attr } from "svelte/internal";
    import { get } from "svelte/store";

	let tmp: boolean;
	let chatRoomsList = [];
	let directMessagesRoomsList = [];
	let messagesList = [];
	let blockList = [];
	let activeChatRoomId;
	let type: string;
	let adminNickname, banNickname, muteNickname, inviteNickname, roomPassword: string;
	let muteDuration: number = 1;
	let mutedUntil;
	let currentTime;
	let invite: boolean = true;
	let chatroom_socket: Socket = undefined;
	let title;

	//Profile popup
	let user_to_display_nickname;

	onMount(async () => {
		try { $user = await $user.upd(); } 
		catch (e) { console.log("Backend unavailable") }
		if (!$user.isLogged) await push("/login");
		else {
			chatroom_socket = io(`${get(SOCKET_URL)}/chatroom`, {
				query: {
					token: getCookie("jwt"),
				},
			});
			await getChatRoomsList();
			await getDirectMessagesRoomsList();
			await getBlockList();

			const interval = setInterval(() => {
				currentTime = new Date();
			}, 1000);

			chatroom_socket.on("chatrooms-list", (data) => {
				console.log("Received chatrooms-list via emit()");
				chatRoomsList = data;
				console.log(chatRoomsList);
			});

			chatroom_socket.on("directmessagesrooms-list", (data) => {
				console.log("Received directmessagesrooms-list via emit()");
				directMessagesRoomsList = data;
				console.log(directMessagesRoomsList);
			});

			chatroom_socket.on("message", (data) => {
				messagesList.push(data);
				messagesList = [...messagesList];
				console.log("Received message: " + data.content);
				scrollToBottom()
			});

			chatroom_socket.on("you-have-been-banned", (data) => {
				console.log(data);
				if ((data === activeChatRoomId)) {
					activeChatRoomId = undefined;
					messagesList = [];
					alert("You have been banned from this chatroom");
				}
			});

			chatroom_socket.on("you-have-been-kicked", (data) => {
				console.log(data);
				if ((data === activeChatRoomId)) {
					activeChatRoomId = undefined;
					messagesList = [];
					alert("You have been kicked from this chatroom");
				}
			});

			$game_socket.on("game-invite-status", (resp) => {
				if (resp["status"] === "sent") invite = false;
				else if (resp["status"] === "annulled") invite = true;
			});
	}
	});

	onDestroy(() => {
		if (chatroom_socket)
			chatroom_socket.disconnect();
	});

	async function getChatRoomsList() {
		chatRoomsList = await fetch(get(BACKEND_URL) + "/chatrooms", {
			method: "GET",
			headers: { Authorization: "Bearer " + getCookie("jwt") },
		}).then((chatrooms) => chatrooms.json());
		console.log("Received chatRoomsList via fetch()");
		console.log(chatRoomsList);
	}

	async function getDirectMessagesRoomsList() {
		directMessagesRoomsList = await fetch(
			get(BACKEND_URL) + "/chatrooms/directmessages",
			{
				method: "GET",
				headers: { Authorization: "Bearer " + getCookie("jwt") },
			}
		).then((rooms) => rooms.json());
		console.log("Received directMessagesRoomsList via fetch()");
		console.log(directMessagesRoomsList);
	}

	async function getBlockList() {
		blockList = await fetch(get(BACKEND_URL) + "/users/blockList", {
			method: "GET",
			headers: { Authorization: "Bearer " + getCookie("jwt") },
		}).then((blockList) => blockList.json());
		console.log("Received blocklist via fetch()");
		console.log(blockList);
	}

	async function joinChatRoom(chatRoomId: number) {
		console.log("In joinChatRoom " + chatRoomId);

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/" + chatRoomId + "/join",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
				},
			}
		);
		const res = await rawresponse.json();
		console.log(res);

		if (res.statusCode === 401) {alert("You are banned from this room")}
	}

	async function joinProtectedChatRoom(e) {
		const formData = new FormData(e.target);
		const chatRoomId = formData.get("chatroomId");
		const password = formData.get("password");
		console.log("In joinProtectedChatRoom: " + chatRoomId + " password: " + password);

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/" + chatRoomId + "/joinProtected",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ password: password }),
			}
		);
		const res = await rawresponse.json();
		console.log(res);
		e.target.reset();

		if (res.statusCode === 401) {alert("You are banned from this room")}
	}

	async function leaveChatRoom(chatRoomId: number) {
		console.log("In leaveChatRoom " + chatRoomId);

		if (activeChatRoomId) {
			const test = await fetch(
				get(BACKEND_URL) + "/chatrooms/" + activeChatRoomId + "/exit",
				{
					method: "PATCH",
					headers: {
						Authorization: "Bearer " + getCookie("jwt"),
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id: chatroom_socket.id }),
				}
			);
		}

		activeChatRoomId = undefined;

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/" + chatRoomId + "/leave",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
				},
			}
		);
		const res = await rawresponse.json();
		console.log(res);
		messagesList = [];
		activeChatRoomId = undefined;
	}

	async function enterChatRoom(chatRoomId: number) {
		console.log("In enterChatRoom " + chatRoomId);

		if (activeChatRoomId && type === "CHAT") {
			const test = await fetch(
				get(BACKEND_URL) + "/chatrooms/" + activeChatRoomId + "/exit",
				{
					method: "PATCH",
					headers: {
						Authorization: "Bearer " + getCookie("jwt"),
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id: chatroom_socket.id }),
				}
			);
		} else if (activeChatRoomId && type === "DM") {
			const test = await fetch(
				get(BACKEND_URL) + "/chatrooms/directmessages/" +
					activeChatRoomId +
					"/exit",
				{
					method: "PATCH",
					headers: {
						Authorization: "Bearer " + getCookie("jwt"),
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id: chatroom_socket.id }),
				}
			);
		}

		activeChatRoomId = chatRoomId;
		type = "CHAT";
		title = chatRoomsList[activeChatRoomId - 1].name;

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/" + chatRoomId + "/messages",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: chatroom_socket.id }),
			}
		);
		const res = await rawresponse.json();

		messagesList = res;
		blockList = [...blockList];

		scrollToBottom()
	}

	async function enterDirectMessagesRoom(DMRoomId: number) {
		console.log("In enterChatRoom " + DMRoomId);

		if (activeChatRoomId && type === "CHAT") {
			const test = await fetch(
				get(BACKEND_URL) + "/chatrooms/" + activeChatRoomId + "/exit",
				{
					method: "PATCH",
					headers: {
						Authorization: "Bearer " + getCookie("jwt"),
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id: chatroom_socket.id }),
				}
			);
		} else if (activeChatRoomId && type === "DM") {
			const test = await fetch(
				get(BACKEND_URL) + "/chatrooms/directmessages/" +
					activeChatRoomId +
					"/exit",
				{
					method: "PATCH",
					headers: {
						Authorization: "Bearer " + getCookie("jwt"),
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id: chatroom_socket.id }),
				}
			);
		}

		activeChatRoomId = DMRoomId;
		type = "DM";
		title = "Direct Message";

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/directmessages/" +
				DMRoomId +
				"/messages",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: chatroom_socket.id }),
			}
		);
		const res = await rawresponse.json();

		messagesList = res;
		blockList = [...blockList];

		scrollToBottom()
	}

	async function banUser(chatRoomId: number, usernickname: string) {
		console.log("In banUser " + usernickname + " room " + chatRoomId);
		if (usernickname === undefined)
			return alert("Please provide a nickname");
		if (usernickname === chatRoomsList[chatRoomId - 1].ownerNickname)
			return alert("Can't ban the owner");

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/" + chatRoomId + "/banUser",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nickname: usernickname }),
			}
		);
		const res = await rawresponse.json();
		banNickname = undefined;

		console.log(res);
		if (res.statusCode === 401) alert("You are not admin");
		else if (res.statusCode === 404) alert("This user doesn't exist");
		else if (res.statusCode === 409) alert("Can't ban the owner");
	}

	async function unbanUser(chatRoomId: number, usernickname: string) {
		console.log("In banUser " + usernickname + " room " + chatRoomId);
		if (usernickname === undefined)
			return alert("Please provide a nickname");

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/" + chatRoomId + "/unbanUser",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nickname: usernickname }),
			}
		);
		const res = await rawresponse.json();
		banNickname = undefined;

		console.log(res);
		if (res.statusCode === 401) alert("You are not admin");
	}

	async function adminUser(chatRoomId: number, usernickname: string) {
		console.log("In adminUser " + usernickname + " room " + chatRoomId);
		if ($user.nickname != chatRoomsList[chatRoomId - 1].ownerNickname)
			return alert("You are not owner");
		if (usernickname === undefined)
			return alert("Please provide a nickname");

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/" + chatRoomId + "/adminUser",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nickname: usernickname }),
			}
		);
		const res = await rawresponse.json();
		adminNickname = undefined;

		console.log(res);
		if (res.statusCode === 401) alert("You are not owner");
		else if (res.statusCode === 404) alert("This user doesn't exist");
	}

	async function unadminUser(chatRoomId: number, usernickname: string) {
		console.log("In unadminUser " + usernickname + " room " + chatRoomId);
		if (usernickname === undefined)
			return alert("Please provide a nickname");
		if (usernickname === chatRoomsList[chatRoomId - 1].ownerNickname)
			return alert("Can't unadmin the owner");

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/" + chatRoomId + "/unadminUser",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nickname: usernickname }),
			}
		);
		const res = await rawresponse.json();
		adminNickname = undefined;

		console.log(res);
		if (res.statusCode) alert("This user doesn't exist");
	}

	async function muteUser(
		chatRoomId: number,
		usernickname: string,
		duration: number
	) {
		console.log("In muteUser " + usernickname + " room " + chatRoomId);
		if (usernickname === undefined)
			return alert("Please provide a nickname");
		if (usernickname === chatRoomsList[chatRoomId - 1].ownerNickname)
			return alert("Can't mute the owner");

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/" + chatRoomId + "/muteUser",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					nickname: usernickname,
					duration: duration,
				}),
			}
		);
		const res = await rawresponse.json();
		muteNickname = undefined;

		console.log(res);
		if (res.statusCode == 401) alert("You are not admin in this chatroom");
		if (res.statusCode == 404) alert("This user doesn't exist");
		if (res.statusCode == 409) alert("Can't mute the owner");

	}

	async function unmuteUser(chatRoomId: number, usernickname: string) {
		console.log("In unmuteUser " + usernickname + " room " + chatRoomId);
		if (usernickname === undefined)
			return alert("Please provide a nickname");

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/" + chatRoomId + "/unmuteUser",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nickname: usernickname }),
			}
		);
		const res = await rawresponse.json();
		muteNickname = undefined;

		console.log(res);
		if (res.statusCode === 401) alert("You are not admin in this chatroom");
		if (res.statusCode === 404) alert("This user is not muted");
	}

	async function postMessageForm(e) {
		const formData = new FormData(e.target);
		const message = formData.get("message");
		console.log(
			"In postMessage " +
				activeChatRoomId +
				" - message: " +
				message +
				" type: " +
				type
		);

		if (type === "CHAT") {
			const rawresponse = await fetch(
				get(BACKEND_URL) + "/chatrooms/" +
					activeChatRoomId +
					"/messages",
				{
					method: "POST",
					headers: {
						Authorization: "Bearer " + getCookie("jwt"),
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ content: message }),
				}
			);
			const res = await rawresponse.json();
			console.log(res);
		} else {
			const rawresponse = await fetch(
				get(BACKEND_URL) + "/chatrooms/directmessages" +
					activeChatRoomId +
					"/messages",
				{
					method: "POST",
					headers: {
						Authorization: "Bearer " + getCookie("jwt"),
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ content: message }),
				}
			);
			const res = await rawresponse.json();
			console.log(res);
		}

		e.target.reset();
	}

	async function inviteUser(chatRoomId: number, usernickname: string) {
		console.log("In inviteUser " + usernickname + " room " + chatRoomId);
		if (usernickname === undefined)
			return alert("Please provide a nickname");

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/" + chatRoomId + "/invite",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nickname: usernickname }),
			}
		);
		const res = await rawresponse.json();
		inviteNickname = undefined;

		console.log(res);
		if (res.statusCode === 401) alert("You are not participant of this room");
		else if (res.statusCode === 404) alert("This user doesn't exist");
		else if (res.statusCode === 409) alert("This user is banned from this room");
	}

	async function kickUser(chatRoomId: number, usernickname: string) {
		console.log("In kickUser " + usernickname + " room " + chatRoomId);
		if (usernickname === undefined)
			return alert("Please provide a nickname");
		if (usernickname === chatRoomsList[chatRoomId - 1].ownerNickname)
			return alert("Can't kick the owner");

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/" + chatRoomId + "/kick",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nickname: usernickname }),
			}
		);
		const res = await rawresponse.json();
		inviteNickname = undefined;

		console.log(res);
		if (res.statusCode === 401) alert("You are not admin of this room");
		else if (res.statusCode === 409) alert("Can't kick the owner");
	}

	async function addPassword(chatRoomId: number, password: string) {
		console.log("In addPassword " + password + " room " + chatRoomId);
		if (password === undefined) return alert("Please provide a password");
		else if (password.length < 3) return alert("Password must be at least 3 characters long");
		else if (password.length > 100) return alert("Password must be at most 100 characters long");

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/" + chatRoomId + "/addPassword",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ password: password }),
			}
		);
		const res = await rawresponse.json();
		roomPassword = undefined

		console.log(res);
	}

	async function changePassword(chatRoomId: number, password: string) {
		console.log("In changePassword " + password + " room " + chatRoomId);
		if (password === undefined) return alert("Please provide a password");
		else if (password.length < 3) return alert("Password must be at least 3 characters long");
		else if (password.length > 100) return alert("Password must be at most 100 characters long");

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/" + chatRoomId + "/changePassword",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ password: password }),
			}
		);
		const res = await rawresponse.json();
		roomPassword = undefined

		console.log(res);
	}

	async function removePassword(chatRoomId: number) {
		console.log("In removePassword " + chatRoomId + " chatRoomId");

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/" + chatRoomId + "/removePassword",
			{
				method: "PATCH",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
				},
			}
		);
		const res = await rawresponse.json();

		console.log(res);
	}

	async function blockUser(nickname: string) {
		// console.log("In blockUser " + nickname);
		if (nickname === $user.nickname)
			return alert("You can't block yourself");

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/users/blockUser/",
			{
				method: "POST",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nickname: nickname }),
			}
		);
		const res = await rawresponse.json();

		if (res.statusCode === 409) alert("You can't block yourself");
		else if (res.statusCode == 404) alert("User not found")
		else if (res.statusCode) alert("Can't block this user");
		else blockList = res;

		console.log(blockList);
	}

	async function unblockUser(nickname: string) {
		// console.log("In blockUser " + nickname);
		if (nickname === undefined) return alert("Please provide a nickname");
		if (nickname === $user.nickname) return alert("You can't unblock yourself");

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/users/unblockUser/",
			{
				method: "DELETE",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nickname: nickname }),
			}
		);
		const res = await rawresponse.json();

		if (res.statusCode === 404) alert("User not found in your blocklist");
		else if (res.statusCode) alert("Can't unblock this user");
		else blockList = res;

		console.log(blockList);
	}

	async function createDirectMessagesRoomForm(e) {
		const formData = new FormData(e.target);
		const participant = formData.get("participant");

		if ($user.nickname === participant)
			return alert("You can't create a room with yourself")

		const rawresponse = await fetch(
			get(BACKEND_URL) + "/chatrooms/directmessages",
			{
				method: "POST",
				headers: {
					Authorization: "Bearer " + getCookie("jwt"),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nickname: participant }),
			}
		);
		const res = await rawresponse.json();
		console.log(res);
		if (res.statusCode === 404) alert("This user doesn't exist");
		if (res.statusCode === 409)
			alert("This DirectMessagesRoom already exist");
		e.target.reset();
	}

	async function findGame(nickname: string) {
		$game_socket.emit("game-invite", nickname);
	}

	async function displayUserProfile(nickname: string) {
		user_to_display_nickname = nickname;

		getModal("user_profile").open();
	}

	async function scrollToBottom() {
		var box = document.getElementById("messages");
		box.scrollTop = await box.scrollHeight + 10000;
	}
</script>

<main>
	<Header />
	<section style="background-color:darkcyan ; margin-top:50px">
		<section style="background-color: darkcyan;">
			<div class="container py-5">
				{#key chatroom_socket}
					{#if !chatroom_socket}
						<div>Backend unavailable - chatroom_socket: {chatroom_socket}</div>
					{:else}
						<div class="row">
							<div class="col-md-12">
								<div
									class="card"
									id="chat3"
									style="border-radius: 15px; background-color:aliceblue "
								>
									<div class="card-body">
										<div id="module" class="row">
											<div
												id="leftcolumn"
												class="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0"
											>
												<div
													id="leftcolumn"
													class="p-3"
												>
													<div
														id="chatroomlist"
														class="overflow-auto DMList rounded"
														style="position: relative; height: 300px; width:auto; overflow-y: scroll"
													>
														{#key chatRoomsList}
															<ul
																class="list-unstyled mb-0"
																style="margin-left: 5%; margin-right: 5%"
															>
																{#each chatRoomsList as chatroom (chatroom.id)}
																	<div
																		class="pt-1 d-flex align-items-center"
																	>
																		{#if chatroom.mode === "PUBLIC"}
																			{#if chatroom.participants.find((x) => x.nickname === $user.nickname) !== undefined}
																				<p
																					class="chatroomname"
																				>
																				💬 {chatroom.name}
																				</p>
																				<button
																					class="btn btn-primary Enter"
																					on:click={() =>
																						enterChatRoom(
																							chatroom.id
																						)}
																					>Enter</button
																				>
																				<button
																					class="btn btn-secondary Enter"
																					on:click={() =>
																						leaveChatRoom(
																							chatroom.id
																						)}
																					>Leave</button
																				>
																			{:else if chatroom.banList.find((x) => x.nickname === $user.nickname) !== undefined}
																				<p
																					class="chatroomname"
																				>
																					{chatroom.name}
																				</p>
																				<button
																					class="btn btn-danger"
																					>Banned</button
																				>
																			{:else}
																				<p
																					class="chatroomname"
																				>
																				💬{chatroom.name}
																				</p>
																				<button
																					class="btn btn-primary"
																					on:click={() =>
																						joinChatRoom(
																							chatroom.id
																						)}
																					>Join</button
																				>
																			{/if}
																		{:else if chatroom.mode === "PROTECTED"}
																			{#if chatroom.participants.find((x) => x.nickname === $user.nickname) !== undefined}
																				<p
																					class="chatroomname"
																				>
																				🔐 {chatroom.name}
																				</p>
																				<button
																					class="btn btn-primary Enter"
																					on:click={() =>
																						enterChatRoom(
																							chatroom.id
																						)}
																					>Enter</button
																				>
																				<button
																					class="btn btn-secondary Enter"
																					on:click={() =>
																						leaveChatRoom(
																							chatroom.id
																						)}
																					>Leave</button
																				>
																			{:else if chatroom.banList.find((x) => x.nickname === $user.nickname) !== undefined}
																				<p
																					class="chatroomname"
																				>
																				🔐 {chatroom.name}
																				</p>
																				<button
																					class="btn btn-danger"
																					>Banned</button
																				>
																			{:else}
																				<form
																					on:submit|preventDefault={joinProtectedChatRoom}
																					style="width: 100%;"
																				>
																					<p
																						class="chatroomname"
																					>
																					🔐 {chatroom.name}
																					</p>
																					<input
																						type="text"
																						name="password"
																						minlength="3"
																						placeholder="password"
																						style="float: right; width:50%"
																						required
																					/>
																					<input
																						type="hidden"
																						name="chatroomId"
																						value={chatroom.id}
																					/>
																				</form>
																			{/if}
																		{:else if chatroom.mode === "PRIVATE"}
																			{#if chatroom.participants.find((x) => x.nickname === $user.nickname) !== undefined}
																				<p
																					class="chatroomname"
																				>
																				🤫 {chatroom.name}
																				</p>
																				<button
																					class="btn btn-primary Enter"
																					on:click={() =>
																						enterChatRoom(
																							chatroom.id
																						)}
																					>Enter</button
																				>
																				<button
																					class="btn btn-secondary Enter"
																					on:click={() =>
																						leaveChatRoom(
																							chatroom.id
																						)}
																					>Leave</button
																				>
																			{/if}
																		{/if}
																	</div>
																{/each}
															</ul>
														{/key}
													</div>
													<button
														type="button"
														style="margin-bottom: 10px; margin-top: 10px; width: 100%"
														class="btn btn-info"
														on:click={getModal(
															"create_chatroom"
														).open}
														>Create Room Form</button
													>
													<div
														id="DMList"
														class="overflow-auto DMList rounded"
														style="position: relative; height: 300px; width:auto; overflow-y: scroll"
													>
														{#each directMessagesRoomsList as DirectMessagesRoom}
															{#if DirectMessagesRoom.participants[0].nickname === $user.nickname}
																{#if blockList.find((x) => x.nickname === DirectMessagesRoom.participants[1].nickname) === undefined}
																	<p
																		class="btn btn-primary"
																		style="width: 100%; margin-bottom: 5px; margin-top: 0px; overflow: hidden"
																		on:click={() =>
																			enterDirectMessagesRoom(
																				DirectMessagesRoom.id
																			)}
																	>
																		{DirectMessagesRoom
																			.participants[1]
																			.nickname}
																	</p>
																{/if}
															{:else if DirectMessagesRoom.participants[1].nickname === $user.nickname}
																{#if blockList.find((x) => x.nickname === DirectMessagesRoom.participants[0].nickname) === undefined}
																	<p
																		class="btn btn-primary"
																		style="width: 100%; margin-bottom: 5px; margin-top: 0px; overflow: hidden"
																		on:click={() =>
																			enterDirectMessagesRoom(
																				DirectMessagesRoom.id
																			)}
																	>
																		{DirectMessagesRoom
																			.participants[0]
																			.nickname}
																	</p>
																{/if}
															{/if}
														{/each}
													</div>
													<form
														on:submit|preventDefault={createDirectMessagesRoomForm}
														style="width: 100%; margin-top: 10px"
													>
														<input
															type="text"
															name="participant"
															minlength="3"
															placeholder="nickname"
															style="float: left; width:100%"
															required
														/>
													</form>
												</div>
											</div>

											<div
												id="messageszone"
												class="col-md-6 col-lg-7 col-xl-8"
											>
												{#if activeChatRoomId}
													<div
														class="d-flex justify-content-center"
														style="position: top"
													>
														<p
															class="p-2 rounded-3 chatroomtitle"
														>
															{title}
														</p>
													</div>
												{/if}
												<div
													id="messages"
													class="t-3 pe-3"
													style="position: relative; height: 400px; overflow-y: scroll"
												>
													{#each messagesList as message (message)}
														<div
															class="d-flex flex-row justify-content-start"
															style="width: 60%"
														>
															<Avatar
																classes="rounded-circle"
																size="45"
																nickname={message
																	.author
																	.nickname}
															/>
															<div>
																<div
																	class="dropdown"
																>
																	<span
																		class="dropdown-toggle mall ms-3 mb-3 rounded-3 text-muted"
																		id="dropdownMenuButton"
																		data-bs-toggle="dropdown"
																		aria-haspopup="true"
																		aria-expanded="false"
																		style="width: auto;height: 5px"
																	>
																		{message
																			.author
																			.nickname}
																	</span>
																	<span
																		class="small ms-3 mb-3 rounded-3 text-muted"
																		style="width: auto;height: 5px"
																		>{new Date(
																			message.creationDate
																		).toLocaleTimeString(
																			"en-US"
																		)}</span
																	>
																	<div
																		class="dropdown-menu"
																		aria-labelledby="dropdownMenuButton"
																	>
																		<p
																			class="dropdown-item"
																			on:click={() =>
																				displayUserProfile(
																					message
																						.author
																						.nickname
																				)}
																		>
																			Profile
																		</p>
																		{#if message.author.nickname != $user.nickname}
																			{#if invite === true}
																				<p
																					class="dropdown-item"
																					on:click={() =>
																						findGame(
																							message
																								.author
																								.nickname
																						)}
																				>
																					Game
																				</p>
																			{:else}
																				<p
																					class="dropdown-item"
																				>
																					Invite
																					sent
																				</p>
																			{/if}
																			<p
																				class="dropdown-item"
																				on:click={() =>
																					blockUser(
																						message
																							.author
																							.nickname
																					)}
																			>
																				Block
																			</p>
																			<p
																				class="dropdown-item"
																				on:click={() =>
																					unblockUser(
																						message
																							.author
																							.nickname
																					)}
																			>
																				Unblock
																			</p>
																		{/if}
																	</div>
																</div>
																<div>
																	{#if message.author.nickname === $user.nickname}
																		<p
																			class="small p-2 ms-3 mb-1 rounded-3 text-break ownmessage"
																		>
																			{message.content}
																		</p>
																	{:else if blockList.find((x) => x.nickname === message.author.nickname) !== undefined}
																		<p
																			class="small p-2 ms-3 mb-1 rounded-3 text-break blockedmessage"
																		>
																			Hidden
																			message
																		</p>
																	{:else}
																		<p
																			class="small p-2 ms-3 mb-1 rounded-3 text-break message"
																		>
																			{message.content}
																		</p>
																	{/if}
																</div>
															</div>
														</div>
													{/each}
												</div>

												{#if activeChatRoomId != undefined}
													<div
														id="typezone"
														class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2"
													>
														<Avatar
															classes="rounded-circle"
															size="45"
															nickname={$user.nickname}
														/>
														{#key activeChatRoomId}
															{#if type === "DM"}
																<form
																	on:submit|preventDefault|stopPropagation={postMessageForm}
																>
																	<input
																		name="message"
																		type="text"
																		minlength="1"
																		maxlength="150"
																		size="50"
																		class="form-control form-control-lg"
																		placeholder="Type here"
																		required
																	/>
																</form>
															{:else if (mutedUntil = chatRoomsList[activeChatRoomId - 1].muteList.find((x) => x.user.nickname === $user.nickname))}
																{#if new Date(mutedUntil.mutedUntil) > currentTime}
																	<p>
																		You are
																		muted
																		until {new Date(
																			mutedUntil.mutedUntil
																		).toLocaleTimeString(
																			"en-US"
																		)}, the
																		current
																		time is {currentTime.toLocaleTimeString(
																			"en-US"
																		)}
																	</p>
																{:else}
																	<form
																		on:submit|preventDefault|stopPropagation={postMessageForm}
																	>
																		<input
																			name="message"
																			type="text"
																			minlength="1"
																			maxlength="150"
																			size="50"
																			class="form-control form-control-lg"
																			placeholder="Type here"
																			required
																		/>
																	</form>
																{/if}
															{:else}
																<form
																	on:submit|preventDefault|stopPropagation={postMessageForm}
																>
																	<input
																		name="message"
																		type="text"
																		minlength="1"
																		maxlength="150"
																		size="50"
																		class="form-control form-control-lg"
																		placeholder="Type here"
																		required
																	/>
																</form>
															{/if}
														{/key}
													</div>
													{#if type === "CHAT"}
														<div id="adminzone">
															<ul>
																{#if chatRoomsList[activeChatRoomId - 1].admin.find((x) => x.nickname === $user.nickname) !== undefined}
																	<div
																	class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2"
																	>
																	<input
																		type="text"
																		class="form-control"
																		placeholder="nickname"
																		bind:value={inviteNickname}
																		style="width: 50%"
																	/>
																	<button
																		class="btn btn-success"
																		on:click={() =>
																			inviteUser(
																				activeChatRoomId,
																				inviteNickname
																			)}
																		>Invite</button
																	>
																	<button
																		class="btn btn-danger"
																		on:click={() =>
																			kickUser(
																				activeChatRoomId,
																				inviteNickname
																			)}
																		>Kick</button
																	>
																	</div>
																{/if}
																{#if chatRoomsList[activeChatRoomId - 1].ownerNickname === $user.nickname}
																	<div
																		class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2"
																	>
																		<input
																			type="text"
																			class="form-control"
																			placeholder="nickname"
																			bind:value={adminNickname}
																			style="width: 50%"
																		/>
																		<button
																			class="btn btn-success"
																			on:click={() =>
																				adminUser(
																					activeChatRoomId,
																					adminNickname
																				)}
																			>Admin</button
																		>
																		<button
																			class="btn btn-danger"
																			on:click={() =>
																				unadminUser(
																					activeChatRoomId,
																					adminNickname
																				)}
																			>Unadmin</button
																		>
																	</div>
																	{#if chatRoomsList[activeChatRoomId - 1].mode === "PUBLIC"}
																		<div
																			class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2"
																		>
																			<input
																				type="text"
																				class="form-control"
																				placeholder="password"
																				minlength="3"
																				bind:value={roomPassword}
																				style="width: 50%"
																			/>
																			<button
																				class="btn btn-success"
																				on:click={() =>
																					addPassword(
																						activeChatRoomId,
																						roomPassword
																					)}
																				>Add</button
																			>
																		</div>
																	{:else if chatRoomsList[activeChatRoomId - 1].mode === "PROTECTED"}
																		<div
																			class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2"
																		>
																			<input
																				type="text"
																				class="form-control"
																				placeholder="password"
																				bind:value={roomPassword}
																				style="width: 50%"
																			/>
																			<button
																				class="btn btn-info"
																				on:click={() =>
																					changePassword(
																						activeChatRoomId,
																						roomPassword
																					)}
																				>Change</button
																			>
																			<button
																				class="btn btn-danger"
																				on:click={() =>
																					removePassword(
																						activeChatRoomId
																					)}
																				>Remove</button
																			>
																		</div>
																	{/if}
																{/if}
																{#if chatRoomsList[activeChatRoomId - 1].admin.find((x) => x.nickname === $user.nickname) !== undefined}
																	<div
																		class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2"
																	>
																		<input
																			type="text"
																			class="form-control"
																			placeholder="nickname"
																			bind:value={banNickname}
																			style="width: 50%"
																		/>
																		<button
																			class="btn btn-success"
																			on:click={() =>
																				banUser(
																					activeChatRoomId,
																					banNickname
																				)}
																			>Ban</button
																		>
																		<button
																			class="btn btn-danger"
																			on:click={() =>
																				unbanUser(
																					activeChatRoomId,
																					banNickname
																				)}
																			>Unban</button
																		>
																	</div>
																	<div
																		class="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2"
																	>
																		<input
																			type="text"
																			class="form-control"
																			placeholder="nickname"
																			bind:value={muteNickname}
																			style="width: 35%"
																		/>
																		<input
																			type="range"
																			min="1"
																			max="60"
																			bind:value={muteDuration}
																			style="width: 15%"
																		/>
																		<button
																			class="btn btn-success"
																			on:click={() =>
																				muteUser(
																					activeChatRoomId,
																					muteNickname,
																					muteDuration
																				)}
																			>Mute
																			{muteDuration}s
																		</button>
																		<button
																			class="btn btn-danger"
																			on:click={() =>
																				unmuteUser(
																					activeChatRoomId,
																					muteNickname
																				)}
																			>Unmute</button
																		>
																	</div>
																{/if}
															</ul>
														</div>
													{/if}
												{/if}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/if}
				{/key}
			</div>
		</section>
	</section>
</main>

<Modal id="create_chatroom">
	<CreateChatRoomForm />
</Modal>

<UserProfile {user_to_display_nickname} />

<style>
	.chatroomname {
		width: 50%;
		display: inline-block;
		font-family: "PT Sans", sans-serif;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.chatroomtitle {
		height: auto;
		width: 50%;
		text-align: center;
		font-family: "PT Sans", sans-serif;
		background-color: rgba(0, 139, 139, 0.301);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.message {
		background-color: rgba(0, 128, 0, 0.315);
		min-height: 37px;
		height: auto;
	}
	.ownmessage {
		background-color: rgba(0, 162, 255, 0.26);
		min-height: 37px;
		height: auto;
	}
	.blockedmessage {
		background-color: grey;
		min-height: 37px;
		height: auto;
	}
	.DMList {
		border: solid rgba(0, 139, 139, 0.568);
	}
	.Enter {
		width: 25%;
	}
</style>
