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

	const eden = await prisma.chatRoom.upsert({
		where: {id: 1},
		update: {},
		create: {
			name: "Eden",
			owner: {connect: {login: "adam"}},
			admin: {connect: {login: "adam"}},
		}
	});

  console.log({ adam, eve, eden })
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