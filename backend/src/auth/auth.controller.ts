import { Controller, Request, Post, UseGuards, Get, Redirect, HttpCode, Req, RequestMapping } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
	JwtAuthGuard,
	LocalAuthGuard,
	FT_OAuthGuard,
	AuthenticatedGuard
} from './guards';
import { RequestWithUser } from './interfaces';
import { ApiBody, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

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
	async login(@Request() req: RequestWithUser) {
		const {access_token} = await this.authService.login(req.user);

		req.res.setHeader('Set-Cookie', [access_token]);

		return {access_token: access_token};

	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async getProfile(@Request() req: RequestWithUser) {
		return this.authService.getProfile(req.user.login);
	}

	@UseGuards(JwtAuthGuard)
	@Get('check')
	checkToken(@Request() req: RequestWithUser) {
		return req.user;
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
