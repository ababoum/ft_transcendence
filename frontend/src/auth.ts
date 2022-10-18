import {CHECK_AUTH_URL, GET_PROFILE_URL} from "./stores";
import {get} from 'svelte/store'

function getCookie(name: string): string {
	let cookieArr = document.cookie.split(";");
	for (let i: number = 0; i < cookieArr.length; i++) {
		let cookiePair = cookieArr[i].split("=");
		if (name == cookiePair[0].trim())
			return decodeURIComponent(cookiePair[1]);
	}
	return "";
}

export function setCookie(name: string, value: string) {
	document.cookie = name + "=" + value;
}

export function eraseCookie(name) {
	document.cookie = name + '=; Max-Age=0'
}

export async function is_authenticated() {
	try {
		const r = await fetch(get(CHECK_AUTH_URL), {
			method: 'GET',
			headers: {"Authorization": "Bearer " + getCookie("jwt")}
		});
		if (r.ok)
			return true;
	} catch (error) {
		console.log("catched error in is_auth (stores.ts)");
	}
	eraseCookie("jwt");
	return false;
}

export async function get_current_user_data() {
	return fetch(get(GET_PROFILE_URL), {
		method: 'GET',
		headers: {"Authorization": "Bearer " + getCookie("jwt")}
	})
}

export async function get_current_user_json() {
	return fetch(get(GET_PROFILE_URL), {
		method: 'GET',
		headers: {"Authorization": "Bearer " + getCookie("jwt")}
	})
	.then(response => response.json());
}

/*
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

*/
