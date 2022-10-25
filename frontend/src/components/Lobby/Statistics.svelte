<script lang="ts">
	export let game_list;
	export let players_count;

	$: games_online = game_list === undefined ? 0 : game_list.games_online;
	$: players_online = players_count === undefined ? 0 : players_count.players_online;
	$: players_in_queue = game_list === undefined ? 0 : game_list.players_in_queue;
</script>

<main>
    <div class="bg-primary pt-10 pb-21"></div>
    <div class="container-fluid mt-n22 px-6">
        <div class="row justify-content-center">
            <div class="col-xl-3 col-lg-6 col-md-12 col-12 mt-6">
                <div class="card rounded-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h4 class="mb-0">Players Online</h4>
                            </div>
                            <img src="/static/icons/users-alt.png" width="25px" height="25px" alt="players-online-icon">
                        </div>
                        <div>
                            <h1 class="fw-bold">{players_online}</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-lg-6 col-md-12 col-12 mt-6">
                <div class="card rounded-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h4 class="mb-0">Games Online</h4>
                            </div>
                            <img src="/static/icons/ping-pong.png" width="25px" height="25px" alt="games-online-icon">
                        </div>
                        <div>
                            <h1 class="fw-bold">{games_online}</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-lg-6 col-md-12 col-12 mt-6">
                <div class="card rounded-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h4 class="mb-0">Players in queue</h4>
                            </div>
                            <img src="/static/icons/globe.png" width="25px" height="25px" alt="pong-online-icon">
                        </div>
                        <div>
                            <h1 class="fw-bold">{players_in_queue}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    .pb-21 {
        padding-bottom: 5.5rem !important;
    }

    .pt-10 {
        padding-top: 4rem !important;
    }

    .row {
        margin-top: -75px;
    }
</style>