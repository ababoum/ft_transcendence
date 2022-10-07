import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';


@Module({
	imports: [
		AuthModule,
		UserModule,
		ChatroomModule,
	],
	controllers: [AppController],
	providers: [],
})
export class ApplicationModule { }