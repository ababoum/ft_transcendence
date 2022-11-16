import { get, readable, writable } from "svelte/store";
import { io } from "socket.io-client";
import { User } from "../types";
import { getCookie } from "./auth";
import { FRONTEND_URL_ENV, BACKEND_URL_ENV, SOCKET_URL_ENV } from "../domain.js"


export const PROFILE_PAGE = readable("/profile");
export const LOBBY_PAGE = readable("/");
export const LOGIN_PAGE = readable("/log");
export const CHATROOM_PAGE = readable("/chatroom");

export const FRONTEND_URL = readable(`${FRONTEND_URL_ENV}`);
export const BACKEND_URL = readable(`${BACKEND_URL_ENV}`);
export const SOCKET_URL = readable(`${SOCKET_URL_ENV}`);
export const CHECK_AUTH_URL = readable(`${BACKEND_URL_ENV}/auth/check`);
export const GET_PROFILE_URL = readable(`${BACKEND_URL_ENV}/auth/profile`);
export const LOGIN_URL = readable(`${BACKEND_URL_ENV}/auth/login`);
export const CREATE_ACC_URL = readable(`${BACKEND_URL_ENV}/users/create`);
export const TOP_10 = readable(`${BACKEND_URL_ENV}/match_history/top10`);
export const GET_NICKNAME_AVATAR = readable(`${BACKEND_URL_ENV}/users/avatar/`)

export const user = writable(new User());
export const game_socket = writable(io(get(SOCKET_URL), {
	query: {
		token: getCookie("jwt")
	}
}));
export const show_nav = writable(true);

export const friends = writable([]);
export const myavatar = writable("");

export const GET_CHATROOMS_URL = readable(`${BACKEND_URL_ENV}/chatrooms`);

// TRY TO USE THOSE, WE CAN TEST HOW IT WORKS OUT
export const login = writable(localStorage.getItem("login") || "login");
login.subscribe((val) => localStorage.setItem("login", val));

export const nickname = writable(localStorage.getItem("nickname") || "nickname");
nickname.subscribe((val) => localStorage.setItem("nickname", val));

export const avatar_url = writable(localStorage.getItem("avatar_url") || "static/default_avatar.png");
avatar_url.subscribe((val) => localStorage.setItem("avatar_url", val));



