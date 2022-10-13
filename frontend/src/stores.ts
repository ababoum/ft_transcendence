import {readable, Writable, writable} from "svelte/store";
import {io} from "socket.io-client";
import error from "svelte/types/compiler/utils/error";

export const PROFILE_URL = readable("/#/profile");
export const GAME_URL = readable("/#/game");
export const LOBBY_URL = readable("/#/");
export const LOGIN_URL = readable("/#/log");
export const game_socket = writable();

function getCookie(name):string {
    let cookieArr = document.cookie.split(";");
    for (let i: number = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim())
            return decodeURIComponent(cookiePair[1]);
    }
    return "cookie is not found";
}

export function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=0'
}

export async function is_authenticated() {
    try {
        const r = await fetch("http://localhost:3000/auth/check", {
            method: 'GET',
            headers: {"Authorization": "Bearer " + getCookie("jwt")}
        });
        if (r.ok)
            return true;
    } catch (error) {
        console.log("catched");
    }
    eraseCookie("jwt");
    return false;
}

export async function get_current_user_data() {
    return  await fetch("http://localhost:3000/auth/profile", {
        method: 'GET',
        headers: {"Authorization": "Bearer " + getCookie("jwt")}
    }).then(response => response.json());
}



