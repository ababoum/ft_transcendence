import Autorisation from "./pages/Autorisation.svelte";
import Lobby from "./pages/Lobby.svelte";
import Profile from "./pages/Profile.svelte";
import Error_page from "./pages/Error_page.svelte";
import Game from "./pages/Game.svelte";

import { PROFILE_URL, GAME_URL, LOBBY_URL, LOGIN_URL} from "./stores";

//FIXME ADD VARIABLES USING
export const routes = {
    "/log": Autorisation,
    "/profile": Profile,
    "/game": Game,
    "/": Lobby,
    "*": Error_page
}