import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { MulterModule } from '@nestjs/platform-express';
import { TwoFactorAuthenticationController } from '../auth/2FA/twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from '../auth/2FA/twoFactorAuthentication.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/auth.guards';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [
		MulterModule.registerAsync({
			useFactory: () => ({
				dest: './upload',
			})
		}),
	],
	providers: [
		UserService, 
		PrismaService, 
		TwoFactorAuthenticationService, 
		AuthService,
		JwtService,
	],
	controllers: [UserController, TwoFactorAuthenticationController],
	exports: [UserService, TwoFactorAuthenticationService],
})

export class UserModule { }