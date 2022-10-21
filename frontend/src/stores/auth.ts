import {CREATE_ACC_URL, LOGIN_PAGE, LOGIN_URL} from "./store";
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

export async function signIn(login: string, password: string) {
	let token;
	await fetch(get(LOGIN_URL), {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({ login, password })
	}).then(response=>response.json())
		.then(data=>{ token = data['access_token']; })
	if (token != undefined) {
		setCookie("jwt", token);
	} else
		throw "Wrong login or password";
}

export async function signUp(login: string, password: string, email: string, nickname: string) {
	let is_registered = true;
	await fetch(get(CREATE_ACC_URL), {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({ login, password, email, nickname })
	}).catch((error) => { is_registered = false });
	console.log(is_registered);
	return is_registered;
}
