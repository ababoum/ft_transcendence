import { Controller, Request, Post, UseGuards, Get, Redirect, HttpCode, Req, RequestMapping, Body } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
	JwtAuthGuard,
	LocalAuthGuard,
	FT_OAuthGuard,
	AuthenticatedGuard
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
	@ApiBody({type: LoginDto})
	@Post('login')
	async login(@Body() body: LoginDto, @Request() req: RequestWithUser) {

		const {access_token} = await this.authService.login(req.user);

		req.res.setHeader('Set-Cookie', [access_token]);

		return {access_token: access_token};

	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	checkToken(@Request() req: RequestWithUser) {
		const login = req.user.login;

		return this.userService.user({login: login});
	}

	/////////////////////// 42 AUTHENTICATION ///////////////////////


	@UseGuards(FT_OAuthGuard)
	@Get('42/return')
	@Redirect('/')
	ftAuthCallback() {
		return;
	}

	/////////////////////// 42 PROFILE ACCESS ///////////////////////


	@Get('42/login')
	@UseGuards(FT_OAuthGuard)
	logIn() {
		return;
	}

	@Get('42/profile')
	@UseGuards(AuthenticatedGuard)
	profile(@Request() req) {
		return req.user;
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
