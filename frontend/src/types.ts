export class loginBase {

	constructor(auth_status?: boolean) {
		this.is_logged_in = auth_status;
	}

	is_logged_in: boolean;
	userID: number;
	userLogin: string;
	imageId: number;
}