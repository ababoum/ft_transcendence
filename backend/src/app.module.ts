import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
	imports: [
		UsersModule,
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
				entities: [],
				synchronize: true,
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [],
	providers: [],
})
export class ApplicationModule { }