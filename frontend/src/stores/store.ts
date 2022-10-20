import { get, readable, writable } from "svelte/store";
import { io } from "socket.io-client";
import { User } from "../types";

export const PROFILE_PAGE = readable("/profile");
export const GAME_PAGE = readable("/game");
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

export const game_socket = writable(io(get(GAME_URL)));
export const is_spectator = writable(false);
export const user = writable(new User());

export const CHATROOM_PAGE = readable("/chatroom");
export const CHATROOM_URL = readable('http://localhost:5678/chatroom');
export const chatroom_socket = writable(io(get(CHATROOM_URL)));
