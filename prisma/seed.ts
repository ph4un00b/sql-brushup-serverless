import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
	const amir = await prisma.user.upsert({
		where: { email: "amir@gmail.com" },
		update: {},
		create: {
			name: "Amir",
			email: "amir@gmail.com",
			cats: {
				create: {
					name: "Ms. Fluff"
				}
			}
		}
	});

	const betty = await prisma.user.upsert({
		where: { email: "betty@gmail.com" },
		update: {},
		create: {
			name: "betty",
			email: "betty@gmail.com",
			cats: {
				create: {
					name: "Keanu"
				}
			}
		}
	});
	console.log({ amir, betty });
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
