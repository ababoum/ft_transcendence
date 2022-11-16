// General imports
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

// Local (user/pwd)
import { Strategy as local_Strategy } from 'passport-local';

// JWT strategy
import { ExtractJwt, Strategy as jwt_Strategy } from 'passport-jwt';
import { jwtConstants } from './auth.constants';

// 42 OAuth strategy
import { Strategy as ft_Strategy } from 'passport-42';
import { ft_profile, TokenPayload } from './auth.interfaces';
import { UserService } from '../user/user.service';
import { Request } from 'express';


///////////////////// LOCAL STRATEGY /////////////////////

@Injectable()
export class LocalStrategy extends PassportStrategy(local_Strategy) {
	constructor(private authService: AuthService) {

		super({
			usernameField: 'login',
			passwordField: 'password'
		});
	}

	async validate(login: string, password: string): Promise<any> {
		const user = await this.authService.validateUser(login, password);
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}

///////////////////// JWT STRATEGY /////////////////////

@Injectable()
export class JwtStrategy extends PassportStrategy(jwt_Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret,
		});
	}

	async validate(payload: any) {
		return { userId: payload.sub, login: payload.username };
	}
}

///////////////////// 42 OAUTH STRATEGY /////////////////////

@Injectable()
export class FtStrategy extends PassportStrategy(ft_Strategy, '42') {
	constructor(private readonly authService: AuthService) {
		super({
			clientID: process.env.FORTYTWO_APP_ID,
			clientSecret: process.env.FORTYTWO_APP_SECRET,
			callbackURL: process.env.CALLBACK_URI,
			profileFields: {
				id: 'id',
				username: 'login',
				email: 'email',
				avatar: 'image_url'
			},
		});
	}

	validate(accessToken: string, refreshToken: string, profile: ft_profile) {
		return profile;
	}
}


///////////////////// TWO FA STRATEGY /////////////////////

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
	jwt_Strategy,
	'jwt-two-factor'
) {
	constructor(
		private readonly userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
				return request?.cookies?.Authentication;
			}]),
			secretOrKey: jwtConstants.secret
		});
	}

	async validate(payload: TokenPayload) {
		const user = await this.userService.getUser({ id: payload.userId });
		if (!user.isTwoFAEnabled) {
			return user;
		}
		if (payload.isSecondFactorAuthenticated) {
			return user;
		}
	}
}