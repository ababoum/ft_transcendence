import {
	ClassSerializerInterceptor,
	Controller,
	Post,
	UseInterceptors,
	Res,
	UseGuards,
	Req,
	HttpCode,
	Body,
	UnauthorizedException,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards';
import { RequestWithUser } from '../auth/interfaces';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';


@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
	constructor(
		private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
		private readonly userService: UserService,
		private readonly authenticationService: AuthService
	) { }

	@Post('generate')
	@UseGuards(JwtAuthGuard)
	async register(@Res() response: Response, @Req() request: RequestWithUser) {

		const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);

		return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
	}

	// The user can generate a QR code, save it in the Google Authenticator application,
	// and send a valid code to the /2fa/turn-on endpoint.
	// If that’s the case, we acknowledge that the two-factor authentication has been saved.

	@Post('turn-on')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async turnOnTwoFactorAuthentication(
		@Req() request: RequestWithUser,
		// @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto
		@Body() twoFactorAuthenticationCode
	) {
		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
			twoFactorAuthenticationCode, request.user
		);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		await this.userService.turnOnTwoFactorAuthentication(request.user.login);
	}

	// Once 2FA is enabled, it can be used for authentication and token issue

	@Post('authenticate')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async authenticate(
		@Req() request: RequestWithUser,
		@Body() twoFactorAuthenticationCode // maybe add DTO later?
	) {
		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
			twoFactorAuthenticationCode, request.user
		);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}

		const accessTokenCookie = this.authenticationService.getCookieWith_2FAJwtAccessToken(request.user.id, true);

		request.res.setHeader('Set-Cookie', [accessTokenCookie]);

		return request.user;
	}


}