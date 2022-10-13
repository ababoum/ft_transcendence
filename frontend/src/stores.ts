import { readable, Writable, writable } from "svelte/store";
import { io } from "socket.io-client";
import { FRONTEND_URL, BACKEND_URL, GAME_DOMAIN} from './domain.js'
import { loginBase } from "./types.js";
import error from "svelte/types/compiler/utils/error";

export const PROFILE_URL = readable("/#/profile");
export const GAME_URL = readable("/#/game");
export const LOBBY_URL = readable("/#/");
export const LOGIN_URL = readable("/#/log");
export const game_socket = writable();

function getCookie(name: string): string {
	let cookieArr = document.cookie.split(";");
	for (let i: number = 0; i < cookieArr.length; i++) {
		let cookiePair = cookieArr[i].split("=");
		if (name == cookiePair[0].trim())
			return decodeURIComponent(cookiePair[1]);
	}
	return "Cookie is not found";
}

export function eraseCookie(name: string) {
	document.cookie = name + '=; Max-Age=0';
}

export async function get_current_user_data(): Promise<loginBase> {
	const resp = await fetch(`${BACKEND_URL}/auth/profile`, {
		method: 'GET',
		headers: { "Authorization": "Bearer " + getCookie("jwt") }
	});

	try {
		if (resp.ok)
		{
			const resp_body = await resp.json();
			const ret = new loginBase();
			ret.is_logged_in = true;
			ret.userID = resp_body.id;
			ret.userLogin = resp_body.login;

			return ret;
		}
	} catch (error) { }
	eraseCookie("jwt");
	return new loginBase(false);
}


