import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { genSaltSync, hashSync } from 'bcryptjs';


@Injectable()
export class AuthService {
	constructor(private userService: UserService) { }

	async validateUser(username: string, pass: string): Promise<any> {

		const user = await this.userService.user({ login: username });

		const salt = genSaltSync(10);
		const hashed_pass = hashSync(pass, salt);

		if (user && user.password === hashed_pass) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}
}

