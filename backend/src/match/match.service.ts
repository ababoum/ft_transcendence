import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma, Match } from '@prisma/client';
import { createMatchDTO } from './match.dto';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Injectable()
export class MatchService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService) { }


	/////////////////////// ACCESS MATCH INFO ///////////////////////

	async getMatches(userNickname?: string)
		: Promise<Match[]> {

		let res: Match[];

		// get all matches
		if (userNickname === undefined) {
			res = await this.prisma.match.findMany();
			return res;
		}

		const user = await this.prisma.user.findUnique({
			where: {
				nickname: userNickname 
			}
		});

		if (user === null)
			return [];

		res = await this.prisma.match.findMany({
			where: {
				OR: [{
					winnerLogin: user.login
				}, {
					loserLogin: user.login
				}]
			},
			include: {
				loser: {
					select: {
						rating: true,
						nickname: true
					}
				},
				winner: {
					select: {
						rating: true,
						nickname: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc' // most recent to less recent
			}
		});

		return res;
	}

	async createMatch(matchData: createMatchDTO): Promise<Match> {

		// check if both winner and loser logins are valid
		const winner = await this.prisma.user.findUnique({
			where: {
				login: matchData.winnerLogin
			}
		});

		if (!winner) {
			throw new HttpException("Winner login is invalid: user not found", 400);
		}

		const loser = await this.prisma.user.findUnique({
			where: {
				login: matchData.loserLogin
			}
		});

		if (!loser) {
			throw new HttpException("Loser login is invalid: user not found", 400);
		}

		const result = await this.prisma.match.create({
			data: {
				winnerScore: matchData.winnerScore,
				loserScore: matchData.loserScore,
				winner: {
					connect: {
						login: matchData.winnerLogin
					}
				},
				loser: {
					connect: {
						login: matchData.loserLogin
					}
				}
			},

		});

		// update the winner's rating
		this.userService.updateUser({
			where: { login: matchData.winnerLogin },
			data: {
				rating: {
					increment: matchData.winnerScore - matchData.loserScore
				}
			}
		});

		return result;

	}
}