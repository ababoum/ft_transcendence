import { BACKEND_URL, CHECK_AUTH_URL, GET_PROFILE_URL, TOP_10 } from "./store";
import { eraseCookie, getCookie } from "./auth";
import { get } from "svelte/store";

export async function get_current_user_data() {
	return fetch(get(GET_PROFILE_URL), {
		method: 'GET',
		headers: { "Authorization": "Bearer " + getCookie("jwt") }
	});
}

export async function get_current_user_json() {
	return fetch(get(GET_PROFILE_URL), {
		method: 'GET',
		headers: { "Authorization": "Bearer " + getCookie("jwt") }
	})
		.then(response => response.json());
}

export async function get_full_profile(login: string) {
	const resp = await fetch(get(BACKEND_URL) + "/users/profile/" + login, {
		method: 'GET',
		headers: { "Authorization": "Bearer " + getCookie("jwt") }
	})
	const payload = resp.json();

	if (resp.ok) {
		return payload;
	} else {
		return null;
	}
}

export async function get_top_10() {
	return fetch(get(TOP_10), {
		method: 'GET',
	}).then(response => response.json());
}

export async function is_authenticated() {
	try {
		const r = await fetch(get(CHECK_AUTH_URL), {
			method: 'GET',
			headers: { "Authorization": "Bearer " + getCookie("jwt") }
		});
		if (r.ok)
			return true;
	} catch (error) {
		console.log("catched error in is_auth (store.ts)");
	}
	eraseCookie("jwt");
	return false;
}