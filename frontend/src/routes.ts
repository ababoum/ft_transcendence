import Autorisation from "./routes/Autorisation.svelte";
import Lobby from "./routes/Lobby.svelte";
import Profile from "./routes/Profile.svelte";
import Error_page from "./routes/Error_page.svelte";
import ChatRoom from "./routes/ChatRoom.svelte";
import TwoFA from "./routes/TwoFA.svelte";
import { get } from 'svelte/store'

import { PROFILE_PAGE, LOBBY_PAGE, LOGIN_PAGE } from "./stores/store";

//FIXME ADD VARIABLES USING
export const routes = {
	"/log": Autorisation,
	"/login": Autorisation,
	"/profile": Profile,
	"/chatroom": ChatRoom,
	"/2FA": TwoFA,
	"/": Lobby,
	"*": Error_page}