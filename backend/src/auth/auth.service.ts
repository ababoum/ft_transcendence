import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './auth.constants';
import { TokenPayload } from './auth.interfaces';


@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private prisma: PrismaService
	) { }

	// validate user based on hashed password in database

	async validateUser(username: string, pass: string): Promise<any> {
		console.log(username, pass)
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

	async getProfile(login: string): Promise<object | null> {
		return this.prisma.user.findUnique({
			where: {
				login: login
			},
			select: {
				id: true,
				email: true,
				nickname: true,
				login: true,
				imageId: true,
			}
		});
	}

	/////////////////// FOR 2FA AUTHENTICATION ///////////////////

	public getCookieWith_2FAJwtAccessToken(userId: number, isSecondFactorAuthenticated = false) {
		const payload: TokenPayload = { userId, isSecondFactorAuthenticated };

		const jwt_secret = jwtConstants.secret;
		const exp_time = jwtConstants.exp_time

		const token = this.jwtService.sign(payload, {
			secret: jwt_secret,
			expiresIn: `${exp_time}s`
		});
		return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${exp_time}`;
	}

	public getCookieWithJwtRefreshToken(userId: number, isSecondFactorAuthenticated = false) {
		const payload: TokenPayload = { userId, isSecondFactorAuthenticated };

		const jwt_secret = jwtConstants.secret;
		const exp_time = jwtConstants.exp_time;

		const token = this.jwtService.sign(payload, {
			secret: jwt_secret,
			expiresIn: `${exp_time}s`
		});
		return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${exp_time}`;
	}


}