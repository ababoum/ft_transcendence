import { Module } from '@nestjs/common';
import { UsersModule } from './module/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './typeorm';
import {GameModule} from "./module/game.module";


@Module({
	imports: [
		GameModule,
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('DB_HOST'),
				port: +configService.get<number>('DB_PORT'),
				username: configService.get('DB_USERNAME'),
				password: configService.get('DB_PASSWORD'),
				database: configService.get('DB_NAME'),
				entities: entities,
				synchronize: true,
			}),
			inject: [ConfigService],
		}),
		UsersModule,
	],
	controllers: [],
	providers: [],
})
export class ApplicationModule { }