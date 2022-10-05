import {readable, Writable, writable} from "svelte/store";
import User from "./User";

export const user: Writable<User> = writable(new User());
export const PROFILE_URL = readable("/#/profile");
export const GAME_URL = readable("/#/game");
export const LOBBY_URL = readable("/#/");
export const LOGIN_URL = readable("/#/log");

