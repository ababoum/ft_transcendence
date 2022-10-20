<script lang="ts">
	import Header from "../components/Nav.svelte";
	import {push} from "svelte-spa-router";
	import {onDestroy, onMount} from "svelte";
	import {get_current_user_data, is_authenticated} from "../stores/requests";

	let tmp: boolean;
	onMount(async () => { tmp = await is_authenticated(); });
	$: is_logged = tmp;
	let is_searching: boolean = false;
	$: is_searching_resp = is_searching;

	let profile = undefined;

	let chatrooms = [{id: 1, name: "Chatroom1"}, {id: 2, name: "Chatroom2"}]

	let messages = [{nickname: "User1", content: "Hey !"}, 
					{nickname: "User2", content: "How are you ?"}, 
					{nickname: "User3", content: "Frontend sucks."}]

	onDestroy(() => {
	})
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
                    <ul class="list-unstyled mb-0">
					{#each chatrooms as chatroom}
                      <li class="p-2 border-bottom">
                        <div class="pt-1">
                          <p>{chatroom.name} <button>Enter</button> </p>
                        </div>
                      </li>
					{/each}
                    </ul>
                  </div>


                </div>

              </div>

		          <div class="col-md-6 col-lg-7 col-xl-8">

		            <div class="pt-3 pe-3" data-mdb-perfect-scrollbar="true"
		              style="position: relative; height: 400px">
					  
					  {#each messages as message}

		              <div class="d-flex flex-row justify-content-start">
		                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
		                  alt="avatar 1" style="width: 45px; height: 100%;">
		                <div>
		                  <p class="small p-2 ms-3 mb-1 rounded-3" style="background-color: #f5f6f7;">{message.nickname}: {message.content}</p>
		                  <p class="small ms-3 mb-3 rounded-3 text-muted">12:00 PM | Aug 13</p>
		                </div>
		              </div>

					  {/each}

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