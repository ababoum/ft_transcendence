import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'
import { AuthController} from './auth.controller'
import { PrismaService } from '../prisma/prisma.service';


@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '2h' }
		}),
	],
	providers: [AuthService, LocalStrategy, JwtStrategy, PrismaService],
	controllers: [AuthController],
	exports: [AuthService],
})

export class AuthModule { }
