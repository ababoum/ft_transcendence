import { get, readable, writable } from "svelte/store";
import { io } from "socket.io-client";
import { User } from "../types";
import {getCookie} from "./auth";

export const PROFILE_PAGE = readable("/profile");
export const LOBBY_PAGE = readable("/");
export const LOGIN_PAGE = readable("/log");

export const FRONTEND_URL = readable('http://localhost:8080');
export const BACKEND_URL = readable('http://localhost:3000');
export const GAME_URL = readable('http://localhost:5678');
export const CHECK_AUTH_URL = readable('http://localhost:3000/auth/check');
export const GET_PROFILE_URL = readable('http://localhost:3000/auth/profile');
export const LOGIN_URL = readable('http://localhost:3000/auth/login');
export const CREATE_ACC_URL = readable('http://localhost:3000/users/create');
export const TOP_10 = readable('http://localhost:3000/match_history/top10');
export const GET_LOGIN_AVATAR = readable('http://localhost:3000/users/avatar/')

export const user = writable(new User());
export const game_socket = writable(io(get(GAME_URL), {
	query: {
		token: getCookie("jwt")
	}
}));

export const CHATROOM_PAGE = readable("/chatroom");
export const CHATROOM_URL = readable('http://localhost:5678/chatroom');
export const chatroom_socket = writable(io(get(CHATROOM_URL)));


// TRY TO USE THOSE, WE CAN TEST HOW IT WORKS OUT
export const login = writable(localStorage.getItem("login") || "login");
login.subscribe((val) => localStorage.setItem("login", val));

export const nickname = writable(localStorage.getItem("nickname") || "nickname");
nickname.subscribe((val) => localStorage.setItem("nickname", val));

export const avatar_url = writable(localStorage.getItem("avatar_url") || "static/default_avatar.png");
avatar_url.subscribe((val) => localStorage.setItem("avatar_url", val));


export const GET_CHATROOMS_URL = readable('http://localhost:3000/chatrooms');
export const chatRooms = writable([])
