import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';


@Module({
	imports: [],
	providers: [UserService, PrismaService],
	controllers: [UserController],
	exports: [UserService],
})

export class UserModule { }