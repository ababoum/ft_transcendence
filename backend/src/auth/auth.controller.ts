import { Controller, Request, Post, UseGuards, Get, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
	JwtAuthGuard,
	LocalAuthGuard,
	FT_OAuthGuard,
	AuthenticatedGuard
} from './guards';

@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService) { }

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
	@Get('42')
	ftAuth() {
		return;
	}

	@UseGuards(FT_OAuthGuard)
	@Get('42/return')
	@Redirect('/')
	ftAuthCallback() {
		return;
	}

	///////////// 42 PROFILE ACCESS //////////////


	@Get('42/login')
	logIn() {
		return;
	}

	@Get('profile')
	@UseGuards(AuthenticatedGuard)
	profile(@Request() req) {
		return req.user;
	}
}
