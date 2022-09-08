import {Controller, Get} from '@nestjs/common';
import {User} from '../user';

@Controller('user')
export class UsersController {

	private users = [
		new User("lala"),
		new User("lolo"),
		new User("lulu")
	];

    @Get()
    getUsers() {
        return this.users;
    }
}