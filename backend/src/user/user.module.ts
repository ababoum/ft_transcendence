import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { MulterModule } from '@nestjs/platform-express';


@Module({
	imports: [
		MulterModule.registerAsync({
			useFactory: () => ({
				dest: './upload',
			})
		}),
	],
	providers: [UserService, PrismaService],
	controllers: [UserController],
	exports: [UserService],
})

export class UserModule { }