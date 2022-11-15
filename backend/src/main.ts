import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import * as bodyParser from 'body-parser';
import { PrismaService } from './prisma/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NotFoundExceptionFilter } from './notFound.filter';

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule);
	let port: number = + process.env.PORT;

	if (port == null || port == 0 || isNaN(port)) {
		port = 3000;
	}

	// Prisma interferes with NestJS enableShutdownHooks.
	// Prisma listens for shutdown signals and will call process.exit() 
	// before your application shutdown hooks fire.
	// To deal with this, we need to add a listener for Prisma beforeExit event.

	const prismaService = app.get(PrismaService);
	await prismaService.enableShutdownHooks(app);

	// binds ValidationPipe to the entire application
	app.useGlobalPipes(new ValidationPipe());

	// apply transform to all responses
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

	// 👇 apply PrismaClientExceptionFilter to entire application, requires HttpAdapterHost because it extends BaseExceptionFilter
	const { httpAdapter } = app.get(HttpAdapterHost);
	app.useGlobalFilters(new NotFoundExceptionFilter());

	app.use(bodyParser.json());

	// enable CORS to allow communication with frontend via 'fetch'
	app.enableCors();

	// Swagger config
	const config = new DocumentBuilder()
		.setTitle('ft_transcendence')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document, { customSiteTitle: 'Prisma Day' });

	await app.listen(port);
}


bootstrap();