import {get_current_user_data} from "./stores/requests";

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

	id: number;
	login: string;
	nickname: string;
	isLogged: boolean;

	public async upd(){
		const resp: any = await get_current_user_data();
		let nu: User = new User();
		if (resp.ok) {
			nu.isLogged = true;
			let data = await resp.json();
			nu.id = data.id;
			nu.login = data.login;
			nu.nickname = data.nickname;
		} else
			nu.isLogged = false;
		return nu;
	}
}