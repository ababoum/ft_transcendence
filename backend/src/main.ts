import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import * as bodyParser from 'body-parser';


async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule);
	let port: number = + process.env.PORT;

	if (port == null || port == 0) {
		port = 3000;
	}

	app.use(bodyParser.json());
	await app.listen(process.env.PORT);
}


bootstrap();