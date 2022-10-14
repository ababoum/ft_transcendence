import Autorisation from "./routes/Autorisation.svelte";
import Lobby from "./routes/Lobby.svelte";
import Profile from "./routes/Profile.svelte";
import Error_page from "./routes/Error_page.svelte";
import Game from "./routes/Game.svelte";
import {get} from 'svelte/store'

import { PROFILE_PAGE, GAME_PAGE, LOBBY_PAGE, LOGIN_PAGE} from "./stores";

//FIXME ADD VARIABLES USING
export const routes = {
    "/log": Autorisation,
    "/profile": Profile,
    "/game": Game,
    "/": Lobby,
    "*": Error_page
}