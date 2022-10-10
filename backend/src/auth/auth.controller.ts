import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

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
	} // no call to db is made

}
