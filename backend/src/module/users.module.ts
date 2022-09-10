import { Module } from '@nestjs/common';
import { UsersController } from '../controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/user.entity';
import { UsersService } from '../service/users.service';

@Module({
	imports: [TypeOrmModule.forFeature([User]),],
	controllers: [UsersController],
	providers: [UsersService],
})

export class UsersModule { }