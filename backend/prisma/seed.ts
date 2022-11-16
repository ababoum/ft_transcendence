import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient()
async function main() {
	const salt = await bcrypt.genSalt();
	let hash = await bcrypt.hash("iamfirst", salt);
	
	
	const adam = await prisma.user.upsert({
		where: {id: 1},
		update: {},
		create: {
			email: "adam@adam.fr",
			login: "adam",
			nickname: "Adam",
			password: hash,
		}
	});

	const adam_avatar = await prisma.image.upsert({
		where: {id: 1},
		update: {},
		create: {
			filename: 'adam_avatar',
			filepath: 'seed_assets/adam.png',
			mimetype: 'image/png',
			size: 24477,
			User: {connect: {login: 'adam'}}
		}
	});
	
	const eve = await prisma.user.upsert({
		where: {id: 2},
		update: {},
		create: {
			email: "eve@eve.fr",
			login: "eve",
			nickname: "Eve",
			password: hash,
		}
	});

	const eve_avatar = await prisma.image.upsert({
		where: {id: 2},
		update: {},
		create: {
			filename: 'eve_avatar',
			filepath: 'seed_assets/eve.png',
			mimetype: 'image/png',
			size: 30384,
			User: {connect: {login: 'eve'}}
		}
	});

	const eden = await prisma.chatRoom.upsert({
		where: {id: 1},
		update: {},
		create: {
			name: "Eden",
			owner: {connect: {login: "adam"}},
			admin: {connect: {login: "adam"}},
		}
	});

	// Default Avatar
	const default_avatar = await prisma.image.upsert({
		where: {id: 3},
		update: {},
		create: {
			filename: 'default_avatar',
			filepath: 'seed_assets/default_avatar.png',
			mimetype: 'image/png',
			size: 15279
		}
	});

  console.log({ adam, eve, eden });
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })