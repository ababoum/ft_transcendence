import { get_current_user_data } from "./stores/requests";
import { game_socket, BACKEND_URL, GET_NICKNAME_AVATAR,  } from "./stores/store";
import { get } from "svelte/store";
import { getCookie } from "./stores/auth";

export class loginBase {

	constructor(auth_status?: boolean) {
		this.is_logged_in = auth_status;
	}

	is_logged_in: boolean;
	userID: number;
	userLogin: string;
	imageId: number;
}

export class User {
	constructor() {
		this.isLogged = false;
	}

	nickname: string;
	isLogged: boolean;
	rating: number;
	email: string;
	isTwoFAEnabled: boolean;
	random_password: boolean;

	public async upd() {
		const resp: any = await get_current_user_data();
		let nu: User = new User();
		if (resp != undefined && resp.ok) {
			nu.isLogged = true;
			let data = await resp.json();
			nu.nickname = data.nickname;
			nu.email = data.email;
			nu.isTwoFAEnabled = data.isTwoFAEnabled;
			nu.random_password = data.random_password;
		} else
			nu.isLogged = false;
		if (nu.isLogged != this.isLogged || this.nickname != nu.nickname)
			await get(game_socket).emit('update-user-data', getCookie('jwt'));
		return nu;
	}

	toJSON() {
		return {
			is_logged: this.isLogged,
			nickname: this.nickname,
		}
	}
}
