import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MatchService } from "./match.service";
import { Match as MatchModel } from '@prisma/client';
import { UserService } from "../user/user.service";
import { createMatchDTO } from './dto'
import { ApiTags } from "@nestjs/swagger";

@Controller('match_history')
@ApiTags('match_history')
export class MatchController {
	constructor(
		private readonly matchService: MatchService,
		private readonly userService: UserService) { }

	@Get()
	async getAllMatches(): Promise<MatchModel[]> {
		return this.matchService.getMatches({});
	}

	@Post('create')
	async addMatch(
		@Body() matchData: createMatchDTO)
		: Promise<MatchModel> {
		return this.matchService.createMatch(matchData);
	}

	@Get('/:login')
	async getUserMatches(@Param('login') userLogin: string): Promise<MatchModel[]> {
		return this.matchService.getMatches({
			where: {
				OR: {
					winnerLogin: userLogin,
					loserLogin: userLogin
				}
			}
		});
	}
}