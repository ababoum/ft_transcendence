import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { MatchService } from "./match.service";
import { Match as MatchModel, User as UserModel } from '@prisma/client';
import { UserService } from "../user/user.service";
import { createMatchDTO } from './dto'
import { ApiTags } from "@nestjs/swagger";
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

	@Post('create')
	async addMatch(
		@Body() matchData: createMatchDTO)
		: Promise<MatchModel> {
		// record the match
		const ret = await this.matchService.createMatch(matchData);

		return ret;
	}

	@Get('/:login')
	@UseGuards(JwtAuthGuard)
	async getUserMatches(@Param('login') userLogin: string): Promise<MatchModel[]> {
		
		const matches = await this.matchService.getMatches(userLogin);
		return matches;
	}
}