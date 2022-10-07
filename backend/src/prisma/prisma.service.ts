import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcryptjs';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

	async onModuleInit() {
		await this.$connect();

		// middleware to protect password
		this.$use(async (params, next) => {

			if (params.action == 'create' && params.model == 'User') {
				const user = params.args.data;
				const salt = genSaltSync(10);
				const hash = hashSync(user.password, salt);
				user.password = hash;
				params.args.data = user;
			}

			return next(params);
		});
	};

	async enableShutdownHooks(app: INestApplication) {
		this.$on('beforeExit', async () => {
			await app.close();
		});
	}
}