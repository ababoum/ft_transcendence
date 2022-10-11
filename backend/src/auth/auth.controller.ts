import { Controller, Request, Post, UseGuards, Get, Redirect, HttpCode, Req } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import {
	JwtAuthGuard,
	LocalAuthGuard,
	FT_OAuthGuard,
	AuthenticatedGuard
} from './guards';
import { RequestWithUser } from './interfaces';

@Controller('auth')
export class AuthController {

	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService
	) { }

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		return this.authService.login(req.user);
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


	///////////// 42 AUTHENTICATION //////////////


	@UseGuards(FT_OAuthGuard)
	@Get('42/return')
	@Redirect('/')
	ftAuthCallback() {
		return;
	}

	///////////// 42 PROFILE ACCESS //////////////


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


	/////////////////// 2 FA LOGIN -> TO BE IMPLEMENTED ////////////////

	// @HttpCode(200)
	// @UseGuards(LocalAuthGuard)
	// @Post('log-in')
	// async logIn_refresh(@Req() request: RequestWithUser) {
	//   const { user } = request;
	//   const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id);
	//   const {
	// 	cookie: refreshTokenCookie,
	// 	token: refreshToken
	//   } = this.authService.getCookieWithJwtRefreshToken(user.id);
   
	//   await this.userService.setCurrentRefreshToken(refreshToken, user.id);
   
	//   request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
   
	//   if (user.isTwoFAEnabled) {
	// 	return;	
	//   }
   
	//   return user;
	// }

}
