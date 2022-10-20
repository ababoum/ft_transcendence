import { LOGIN_PAGE } from "./store";
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
