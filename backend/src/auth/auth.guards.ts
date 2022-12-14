import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	canActivate(context: ExecutionContext) {
		// Add your custom authentication logic here
		// for example, call super.logIn(request) to establish a session.
		return super.canActivate(context);
	}

	handleRequest(err, user, info) {
		// You can throw an exception based on either "info" or "err" arguments
		if (err || !user) {
			throw err || new UnauthorizedException();
		}
		return user;
	}
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { }


@Injectable()
export class FT_OAuthGuard extends AuthGuard('42') {}


@Injectable()
export default class JwtTwoFactorGuard extends AuthGuard('jwt-two-factor') {}