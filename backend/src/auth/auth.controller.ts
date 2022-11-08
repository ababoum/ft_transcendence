import { Controller, Request, Post, UseGuards, Get, Redirect, HttpCode, Req, RequestMapping, Body, Res, Param, Query, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
	JwtAuthGuard,
	LocalAuthGuard,
	FT_OAuthGuard
} from './auth.guards';
import { RequestWithUser } from './auth.interfaces';
import { ApiBody, ApiTags } from '@nestjs/swagger';
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

		const user = await this.userService.user({ login: req.user.login });

		// check if login exists
		if (!user) {
			throw new HttpException("Wrong login or password", 401);
		}

		// check if 2FA is enabled
		if (user.isTwoFAEnabled) {
			return { TwoFA: true, access_token: null };
		}


		// if 2FA is not enabled, immediately send access token
		const { access_token } = await this.authService.login(req.user);
		req.res.setHeader('Set-Cookie', [access_token]);

		return { TwoFA: false, access_token: access_token };
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
			req.user.id,
			req.user.avatar);

		if (!usr.isTwoFAEnabled) {
			// emit a token after successful login (no 2FA)
			const { access_token } = await this.authService.login({
				login: usr.login,
				sub: usr.id
			});

			// we update the user's status here because the frontend can't do it in this situation
			await this.userService.updateStatus(usr.login, "online");
			res.cookie('jwt', access_token);
			res.status(HttpStatus.FOUND).redirect(process.env.FRONTEND_URL);
		}
		else {
			const url = new URL(process.env.FRONTEND_URL + "/#/2FA");
			url.port = process.env.FRONT_PORT;
			// url.pathname = '#/2FA';
			url.searchParams.append('login', usr.login);
			console.log(url.hash);
			res.status(HttpStatus.FOUND).redirect(url.href);
		}
	}


	/////////////////////// 2 FA LOGIN  ///////////////////////

	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('log-in')
	async logIn_2fa(@Req() request: RequestWithUser) {
		const { user } = request;
		const accessTokenCookie = await this.authService.getCookieWith_2FAJwtAccessToken(user.login);

		request.res.setHeader('Set-Cookie', [accessTokenCookie]);

		if (user.isTwoFAEnabled) {
			return;
		}
		return user;
	}

}
