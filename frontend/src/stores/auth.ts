import { CREATE_ACC_URL, LOGIN_PAGE, LOGIN_URL } from "./store";
import { get } from 'svelte/store'
import { push } from "svelte-spa-router";

export function getCookie(name: string): string {
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

export async function logout() {
	eraseCookie("jwt");
	await push(get(LOGIN_PAGE));
}

export async function signIn(login: string, password: string)
	: Promise<{ TwoFA: boolean, message: string }> {

	let token;
	const resp = await fetch(get(LOGIN_URL), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ login, password })
	});

	if (resp.ok) {
		await resp.json()
			.then(data => { token = data['access_token']; })

		// 2FA is not enabled
		if (token) {
			setCookie("jwt", token);
			return { TwoFA: false, message: "" };
		} else {
			return { TwoFA: true, message: "" };
		}
	}
	else
		return { TwoFA: false, message: "Wrong login or password" };
}

export async function signUp(login: string, password: string, email: string, nickname: string) {
	let msg: string = "";
	const resp = await fetch(get(CREATE_ACC_URL), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ login, password, email, nickname })
	});
	if (resp.ok)
		return msg;
	await resp.json().then((data) => msg = data.message);
	return msg;
}
