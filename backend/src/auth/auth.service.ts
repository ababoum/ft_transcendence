import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService
	) { }

	// validate user based on hashed password in database

	async validateUser(username: string, pass: string): Promise<any> {
		const user = await this.userService.user({ login: username });
		if (user) {
			if (await bcrypt.compare(pass, user.password)) {
				const { password, ...result } = user;
				return result;
			}
		}
		return null;
	}

	async login(user: any) {
		const payload = { username: user.login, sub: user.userId };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}