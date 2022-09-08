import {Body, Controller, Get, Post} from '@nestjs/common';
import {User} from '../user';

@Controller('users')
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

	@Post('create')
	createUser(@Body() user: User) {
		this.users.push(user);
	}
}