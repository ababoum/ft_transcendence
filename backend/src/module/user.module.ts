import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { PrismaService } from '../service/prisma.service';
import { UserService } from '../service/user.service';


@Module({
	imports: [],
	controllers: [UserController],
	providers: [UserService, PrismaService],
})

export class UserModule { }