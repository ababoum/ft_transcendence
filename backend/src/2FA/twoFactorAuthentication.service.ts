import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User as UserModel } from '@prisma/client';
import { UserService } from '../user/user.service';
import { toFileStream } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class TwoFactorAuthenticationService {
	constructor(
		private readonly usersService: UserService,
	) { }


	public async generateTwoFactorAuthenticationSecret(user: UserModel) {
		const secret = authenticator.generateSecret();
		const app_name: string = process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME as string;

		const otpauthUrl = authenticator.keyuri(
			user.email,
			app_name,
			secret);

		await this.usersService.setTwoFactorAuthenticationSecret(secret, user.login);

		return {
			secret,
			otpauthUrl
		};
	}

	public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl);
	}

	public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: UserModel) {
		return authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: user.TwoFA_secret
		});
	}
}