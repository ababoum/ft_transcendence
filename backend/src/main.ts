import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import * as bodyParser from 'body-parser';
import { PrismaService } from './prisma/prisma.service';
import { PrismaClientExceptionFilter } from './prisma/prisma.filter';


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

	app.use(bodyParser.json());

	// 👇 apply PrismaClientExceptionFilter to entire application, requires HttpAdapterHost because it extends BaseExceptionFilter
	const { httpAdapter } = app.get(HttpAdapterHost);
	app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

	
	await app.listen(port);
}


bootstrap();