import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { GameServer } from "./GameServer";
import { UserService } from "../user/user.service";
import { MatchService } from "../match/match.service";

@Module({
	providers: [
		GameGateway,
		JwtService,
		PrismaService,
		GameServer,
		UserService,
		MatchService
	]
})

export class GameModule { }