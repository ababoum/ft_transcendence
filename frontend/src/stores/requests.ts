import { BACKEND_URL, CHECK_AUTH_URL, GET_PROFILE_URL, TOP_10 } from "./store";
import { eraseCookie, getCookie, setCookie } from "./auth";
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
	});
	const payload = resp.json();

	if (resp.ok) {
		return payload;
	} else {
		return null;
	}
}

export async function get_user_public_data(nickname: string) {
	const resp = await fetch(get(BACKEND_URL) + "/users/public/" + nickname, {
		method: 'GET',
		headers: { "Authorization": "Bearer " + getCookie("jwt") }
	});

	const data = await resp.json();

	return data;
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


////////////////////////////// MANAGE USER INFO //////////////////////////////



export async function update_email(new_email: string) {

	let msg: string = null;
	const resp = await fetch(get(BACKEND_URL) + "/users/update/email", {
		method: 'PATCH',
		headers: {
			"Authorization": "Bearer " + getCookie("jwt"),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ new_email })
	});

	if (resp.ok)
		return msg;
	await resp.json().then((data) => msg = data.message);
	return msg;
}

export async function update_nickname(new_nickname: string) {

	let msg: string = null;
	const resp = await fetch(get(BACKEND_URL) + "/users/update/nickname", {
		method: 'PATCH',
		headers: {
			"Authorization": "Bearer " + getCookie("jwt"),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ new_nickname })
	});

	if (resp.ok)
		return msg;
	await resp.json().then((data) => msg = data.message);
	return msg;
}

export async function update_password(
	old_password: string,
	new_password: string) {

	let msg: string = null;
	const resp = await fetch(get(BACKEND_URL) + "/users/update/password", {
		method: 'PATCH',
		headers: {
			"Authorization": "Bearer " + getCookie("jwt"),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(
			{
				old_password: old_password,
				new_password: new_password
			})
	});

	if (resp.ok)
		return msg;
	await resp.json().then((data) => msg = data.message);
	return msg;
}

export async function update_status(status: string) {
	let msg: string = null;
	const resp = await fetch(get(BACKEND_URL) + "/users/status/" + status, {
		method: 'PATCH',
		headers: {
			"Authorization": "Bearer " + getCookie("jwt")
		}
	});

	if (resp.ok)
		return msg;
	await resp.json().then((data) => msg = data.message);
	return msg;
}

///////////////////////////////// 2FA AUTH /////////////////////////////////


export async function validate_2fa_code(twoFactorAuthenticationCode: string) {
	const resp = await fetch(get(BACKEND_URL) + "/2fa/turn-on", {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + getCookie("jwt"),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(
			{
				twoFactorAuthenticationCode: twoFactorAuthenticationCode
			})
	});

	if (resp.ok) {
		return `<p class="text-success">Two factor authentication successfully enabled</p>`;
	}
	else {
		const msg = await resp.json().then(data => data.message);
		return `<p class="text-danger">${msg}</p>`;
	}
}

export async function authenticate_2fa_code(login: string, twoFactorAuthenticationCode: string)
	: Promise<{ success: boolean, message: string, access_token: string }> {

	const resp = await fetch(get(BACKEND_URL) + "/2fa/authenticate", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(
			{
				login: login,
				twoFactorAuthenticationCode: twoFactorAuthenticationCode
			})
	});

	if (resp.ok) {
		const token = await resp.json().then(data => data.access_token);

		setCookie("jwt", token);
		return { success: true, message: `<p class="text-success">Code valid!</p>`, access_token: token };
	}
	else {
		const msg = await resp.json().then(data => data.message);
		return { success: false, message: `<p class="text-danger">${msg}</p>`, access_token: null };
	}
}

export async function disable_2fa() {
	const resp = await fetch(get(BACKEND_URL) + "/2fa/disable", {
		method: 'PATCH',
		headers: {
			"Authorization": "Bearer " + getCookie("jwt")
		}
	});
}


///////////////////////////////// FRIENDS /////////////////////////////////

export async function get_friends(login: string) {
	const resp = await fetch(get(BACKEND_URL) + "/users/myfriends", {
		method: 'GET',
		headers: {
			"Authorization": "Bearer " + getCookie("jwt")
		}
	});

	return resp.json();
}

export async function add_friend(nickname: string) {
	const resp = await fetch(get(BACKEND_URL) + "/users/add_friend", {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + getCookie("jwt"),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(
			{
				nickname: nickname
			})
	});

	return resp;
}

export async function delete_friend(nickname: string) {
	const resp = await fetch(get(BACKEND_URL) + "/users/friend", {
		method: 'DELETE',
		headers: {
			"Authorization": "Bearer " + getCookie("jwt"),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(
			{
				nickname: nickname
			})
	});

	return resp;
}

//////////////////////////// MATCHES and RATINGS /////////////////////////////

export async function get_matches(login: string) {
	const resp = await fetch(get(BACKEND_URL) + "/match_history/" + login, {
		method: 'GET',
		headers: {
			"Authorization": "Bearer " + getCookie("jwt"),
			'Content-Type': 'application/json'
		}
	});

	return await resp.json();
}

export async function get_top_10() {
	return fetch(get(TOP_10), {
		method: 'GET',
	}).then(response => response.json());
}