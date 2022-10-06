<script lang="ts">
    import { PROFILE_URL, GAME_URL, LOBBY_URL, LOGIN_URL} from "../stores";
</script>

<main>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">TRANSCENDENCE</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href={$PROFILE_URL}>Profile</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href={$GAME_URL}>GAME</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{$LOGIN_URL}">Login</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{$LOBBY_URL}">Lobby</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <br><br>
</main>