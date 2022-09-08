import {Module} from '@nestjs/common';
import {UsersController} from './controller/users.controller';


@Module({
	// modules: [],
    controllers: [UsersController]
})
export class ApplicationModule { }