import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { MulterModule } from '@nestjs/platform-express';
import { TwoFactorAuthenticationController } from './twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards';
import { JwtService } from '@nestjs/jwt';


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
		JwtService
	],
	controllers: [UserController, TwoFactorAuthenticationController],
	exports: [UserService, TwoFactorAuthenticationService],
})

export class UserModule { }