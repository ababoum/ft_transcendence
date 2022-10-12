import Autorisation from "./routes/Autorisation.svelte";
import Lobby from "./routes/Lobby.svelte";
import Profile from "./routes/Profile.svelte";
import Error_page from "./routes/Error_page.svelte";
import Game from "./routes/Game.svelte";

import { PROFILE_URL, GAME_URL, LOBBY_URL, LOGIN_URL} from "./stores";

//FIXME ADD VARIABLES USING
export const routes = {
    "/log": Autorisation,
    "/profile": Profile,
    "/game": Game,
    "/": Lobby,
    "*": Error_page
}