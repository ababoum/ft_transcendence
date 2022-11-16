import { HttpException, Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User, User as UserModel } from '@prisma/client';
import { UserService } from '../../user/user.service';
import { toFileStream } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class TwoFactorAuthenticationService {
	constructor(
		private readonly usersService: UserService,
	) { }


	public async generateTwoFactorAuthenticationSecret(login: string) {

		let secret: any;
		const app_name: string = process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME as string;

		// if the user already has a secret, don't generate a new one
		const usr = await this.usersService.user({ login: login });
		if (!usr.TwoFA_secret) {
			secret = authenticator.generateSecret();
			await this.usersService.setTwoFactorAuthenticationSecret(secret, login);
		}
		else {
			secret = usr.TwoFA_secret;
		}

		const otpauthUrl = authenticator.keyuri(
			usr.email,
			app_name,
			secret);

		return {
			secret,
			otpauthUrl
		};
	}

	public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl);
	}

	public async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, login: string): Promise<boolean> {

		const user = await this.usersService.user({ login: login });
		if (!user)
			throw new HttpException("User not found", 404);

		const verif = authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: user.TwoFA_secret
		});

		return verif;
	}

	public async disable_TwoFA(login: string): Promise<User> {
		const user = await this.usersService.updateUser({
			where: { login: login },
			data: { isTwoFAEnabled: false }
		});

		return user;
	}
}