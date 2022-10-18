<script lang="ts">
	import Header from "../components/Nav.svelte";
	import {push} from "svelte-spa-router";
	import {onDestroy, onMount} from "svelte";
	import {get_current_user_data, is_authenticated} from "../auth.js";

	let tmp: boolean;
	onMount(async () => { tmp = await is_authenticated(); });
	$: is_logged = tmp;
	let is_searching: boolean = false;
	$: is_searching_resp = is_searching;

	let profile = undefined;

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

                  <div class="input-group rounded mb-3">
                    <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search"
                      aria-describedby="search-addon" />
                  </div>

                  <div data-mdb-perfect-scrollbar="true" style="position: relative; height: 400px">
                    <ul class="list-unstyled mb-0">
                      <li class="p-2 border-bottom">
                        <a href="#!" class="d-flex justify-content-between">
                          <div class="d-flex flex-row">
                            <div>
                              <span class="badge bg-success badge-dot"></span>
                            </div>
                            <div class="pt-1">
                              <p class="fw-bold mb-0">ChatRoom1</p>
                              <p class="small text-muted">Hello, Are you there?</p>
                            </div>
                          </div>
                          <div class="pt-1">
                            <p class="small text-muted mb-1">Just now</p>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>

                </div>

              </div>

              <div class="col-md-6 col-lg-7 col-xl-8">

                <div class="pt-3 pe-3" data-mdb-perfect-scrollbar="true"
                  style="position: relative; height: 400px">

                  <div class="d-flex flex-row justify-content-start">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                      alt="avatar 1" style="width: 45px; height: 100%;">
                    <div>
                      <p class="small p-2 ms-3 mb-1 rounded-3" style="background-color: #f5f6f7;">Lorem ipsum
                        dolor
                        sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                        dolore
                        magna aliqua.</p>
                      <p class="small ms-3 mb-3 rounded-3 text-muted float-end">12:00 PM | Aug 13</p>
                    </div>
                  </div>

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