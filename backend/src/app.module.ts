import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from "./game/game.module";


@Module({
	imports: [
		AuthModule,
		UserModule,
		ChatroomModule,
		GameModule
	],
	controllers: [],
	providers: [],
})
export class ApplicationModule { }