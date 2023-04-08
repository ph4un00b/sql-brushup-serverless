import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
async function main() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  await prisma.vaccination.upsert({
    where: { cat_name: "Ms. Fluff" },
    update: {},
    create: {
      // data: {
      cat_name: "Ms. Fluff",
    },
  });

  const amir = await prisma.user.upsert({
    where: { email: "amir@gmail.com" },
    update: {},
    create: {
      name: "Amir",
      email: "amir@gmail.com",
      cats: {
        create: {
          name: "Ms. Fluff",
        },
      },
    },
  });

  const betty = await prisma.user.upsert({
    where: { email: "betty@gmail.com" },
    update: {},
    create: {
      name: "betty",
      email: "betty@gmail.com",
      cats: {
        create: {
          name: "Keanu",
        },
      },
    },
  });

  const many = 60_000;
  async function seedTestNames(many: number) {
    const names = new Set<string>();
    console.time("generate-many-" + many);
    while (names.size < many) {
      names.add(faker.internet.userName());
    }
    console.timeEnd("generate-many-" + many);

    console.time("spread-many-" + many);
    const namesArray = [...names];
    console.timeEnd("spread-many-" + many);

    await prisma.testNames.createMany({
      data: namesArray.map((name) => ({ name })),
      skipDuplicates: true,
    });

    console.log("Seeding completed!");
  }

  console.time("create-many" + many);
  /**
   * chunks of data
   * PS throws error
   * my guess: due to reaching data limits
   * @todo research
   */
  await seedTestNames(many);
  await seedTestNames(many);
  await seedTestNames(many);
  await seedTestNames(many);
  await seedTestNames(many);
  await seedTestNames(many);
  await seedTestNames(many);
  await seedTestNames(many);
  await seedTestNames(many);
  await seedTestNames(many);
  console.timeEnd("create-many" + many);
  // console.log({ amir, betty });
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
