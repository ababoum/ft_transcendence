import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy, JwtStrategy, FtStrategy } from './auth.strategies';
import { jwtConstants } from './auth.constants';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller'
import { PrismaService } from '../prisma/prisma.service';


@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '24h' }
		}),
	],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		FtStrategy,
		PrismaService
	],
	controllers: [AuthController],
	exports: [AuthService],
})

export class AuthModule { }
