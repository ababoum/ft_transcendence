import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { AuthModule } from './auth/auth.module';


@Module({
	imports: [
		UserModule,
		ChatroomModule,
		AuthModule
	],
	controllers: [],
	providers: [],
})
export class ApplicationModule { }