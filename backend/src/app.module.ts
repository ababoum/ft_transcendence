import { Module } from '@nestjs/common';
import { UserModule } from './module/user.module';
import { ChatroomModule } from './chatroom/chatroom.module';


@Module({
	imports: [
		UserModule,
		ChatroomModule
	],
	controllers: [],
	providers: [],
})
export class ApplicationModule { }