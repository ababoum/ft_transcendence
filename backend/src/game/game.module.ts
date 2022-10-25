import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import {JwtService} from "@nestjs/jwt";
import {PrismaService} from "../prisma/prisma.service";

@Module({
    providers: [GameGateway, JwtService, PrismaService]
})
export class GameModule {}