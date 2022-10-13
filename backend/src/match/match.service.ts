import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma, Match } from '@prisma/client';
import { createMatchDTO } from './dto';

@Injectable()
export class MatchService {
	constructor(private prisma: PrismaService) { }


	/////////////////////// ACCESS MATCH INFO ///////////////////////

	async getMatches(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.MatchWhereUniqueInput;
		where?: Prisma.MatchWhereInput;
		orderBy?: Prisma.MatchOrderByWithRelationInput;
	}): Promise<Match[]> {

		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.match.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async createMatch(matchData: createMatchDTO): Promise<Match> {

		return this.prisma.match.create({
			data : {
				winnerScore: matchData.winnerScore,
				loserScore: matchData.loserScore,
				winner: {
					connect: {
						login: matchData.winnerLogin
					}
				},
				loser : {
					connect : {
						login: matchData.loserLogin
					}
				}
			},
			
		});
	}
}