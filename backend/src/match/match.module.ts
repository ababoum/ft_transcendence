import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
	imports: [],
	providers: [MatchService],
	controllers: [MatchController],
	exports: [],
})

export class MatchModule { }