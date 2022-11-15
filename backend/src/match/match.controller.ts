import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { MatchService } from "./match.service";
import { Match as MatchModel, User as UserModel } from '@prisma/client';
import { UserService } from "../user/user.service";
import { createMatchDTO } from './dto'
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/auth.guards";

@Controller('match_history')
@ApiTags('match_history')
export class MatchController {
	constructor(
		private readonly matchService: MatchService,
		private readonly userService: UserService) { }

	@Get()
	async getAllMatches(): Promise<MatchModel[]> {
		return this.matchService.getMatches();
	}

	@Get('top10')
	async getTop10Players(): Promise<UserModel[]> {
		return this.userService.users({
			take: 10,
			orderBy: { rating: 'desc' }
		});
	}

	@Get('/:nickname')
	@UseGuards(JwtAuthGuard)
	async getUserMatches(@Param('nickname') userNickname: string): Promise<MatchModel[]> {
		
		const matches = await this.matchService.getMatches(userNickname);
		return matches;
	}
}