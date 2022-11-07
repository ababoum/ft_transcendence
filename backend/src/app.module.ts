import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from "./game/game.module";
import { MatchModule } from './match/match.module';
import { DirectmessagesModule } from './directmessages/directmessages.module';


@Module({
	imports: [
		AuthModule,
		UserModule,
		ChatroomModule,
		GameModule,
		MatchModule,
		DirectmessagesModule
	],
	controllers: [],
	providers: [],
})
export class ApplicationModule { }