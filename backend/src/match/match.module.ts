import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
	imports: [],
	providers: [MatchService, PrismaService, UserService],
	controllers: [MatchController],
	exports: [],
})

export class MatchModule { }