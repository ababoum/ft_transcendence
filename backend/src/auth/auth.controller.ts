import { Controller, Request, Post, UseGuards, Get, Redirect, HttpCode, Req, RequestMapping, Body, Res, Param, Query, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
	JwtAuthGuard,
	LocalAuthGuard,
	FT_OAuthGuard
} from './auth.guards';
import { RequestWithUser } from './auth.interfaces';
import { ApiBody, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {

	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService
	) { }

	@UseGuards(LocalAuthGuard)
	@ApiBody({ type: LoginDto })
	@Post('login')
	async login(@Body() body: LoginDto, @Request() req: RequestWithUser) {

		const { access_token } = await this.authService.login(req.user);
		req.res.setHeader('Set-Cookie', [access_token]);
		return { access_token: access_token };

	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async getProfile(@Request() req) {
		return this.authService.getProfile(req.user.login);
	}

	@UseGuards(JwtAuthGuard)
	@Get('check')
	checkToken(@Request() req) {
		return req.user;
	}

	/////////////////////// 42 AUTHENTICATION ///////////////////////


	@Get('42')
	@UseGuards(FT_OAuthGuard)
	ft_auth() { }


	@Get('42/redirect')
	@UseGuards(FT_OAuthGuard)
	async ft_authRedirect(@Req() req, @Res() res) {

		const usr = await this.userService.userFindOrCreate(
			req.user.username,
			req.user.email,
			req.user.id);

		// emit a token after successful login
		const { access_token } = await this.authService.login({
			login: usr.login,
			sub: usr.id
		});
		res.cookie('jwt', access_token);
		res.status(HttpStatus.FOUND).redirect(process.env.FRONTEND_URL);
	}


	/////////////////////// 2 FA LOGIN  ///////////////////////

	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('log-in')
	async logIn_2fa(@Req() request: RequestWithUser) {
		const { user } = request;
		const accessTokenCookie = this.authService.getCookieWith_2FAJwtAccessToken(user.id);

		request.res.setHeader('Set-Cookie', [accessTokenCookie]);

		if (user.isTwoFAEnabled) {
			return;
		}
		return user;
	}

}
