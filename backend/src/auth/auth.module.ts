import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy, JwtStrategy, FtStrategy } from './auth.strategies';
import { jwtConstants } from './auth.constants';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller'
import { PrismaService } from '../prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';


@Module({
	imports: [
		UserModule,
		PassportModule,
		HttpModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '24h' }
		}),
		PassportModule.register({
			
		})
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
