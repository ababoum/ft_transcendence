import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

	async onModuleInit() {
		await this.$connect();

		// middleware to protect password
		this.$use(async (params, next) => {
			if (params.model == 'User' && params.action == 'create') {
				const user = params.args.data;
				const salt = await bcrypt.genSalt();
				const hash = await bcrypt.hash(user.password, salt);
				user.password = hash;
				params.args.data = user;
			}
			else if (params.model == 'User' &&
				params.action == 'update' &&
				params.args.data.password) {
				const user = params.args.data;
				const salt = await bcrypt.genSalt();
				const hash = await bcrypt.hash(user.password, salt);
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