import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule);

	const config = new DocumentBuilder()
		.setTitle('Nestjs with Postgres')
		.setVersion('1.0')
		.addTag('nest-postgres')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	app.use(bodyParser.json());
	await app.listen(3000);
}


bootstrap();