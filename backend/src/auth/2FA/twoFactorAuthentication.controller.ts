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
	Patch,
	HttpException,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { TwoFactorAuthenticationCodeDto, TwoFactorAuthenticationDto } from './twoFactorAuthentication.dto'
import { Response } from 'express';
import { JwtAuthGuard } from '../auth.guards';
import { RequestWithUser } from '../auth.interfaces';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';


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

		const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user.login);

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
		@Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto
	) {
		if (parseInt(twoFactorAuthenticationCode) < 0) {
			throw new HttpException("twoFactorAuthenticationCode must be a positive integer", 400);
		}
		const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
			twoFactorAuthenticationCode, request.user.login
		);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		await this.userService.turnOnTwoFactorAuthentication(request.user.login);
	}

	// Once 2FA is enabled, it can be used for authentication and token issue

	@Post('authenticate')
	@HttpCode(200)
	async authenticate(
		@Req() request: RequestWithUser,
		@Body() body: TwoFactorAuthenticationDto
	) {
		const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
			body.twoFactorAuthenticationCode, body.login
		);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}

		const accessTokenCookie = await this.authenticationService.getCookieWith_2FAJwtAccessToken(body.login);
		return {access_token: accessTokenCookie};
	}

	@Patch('disable')
	@UseGuards(JwtAuthGuard)
	async disable_2fa(
		@Req() request: RequestWithUser
	) {
		this.twoFactorAuthenticationService.disable_TwoFA(request.user.login);
	}

}