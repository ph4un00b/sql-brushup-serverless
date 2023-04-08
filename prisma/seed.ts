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

  let many = 60_000;
  const countNames = await prisma.testNames.count();

  if (countNames > 250_000) {
    console.time("count-many-" + 250_000);
    console.log({ countNames });
    console.timeEnd("count-many-" + 250_000);
  } else {
    console.time("create-many-" + many);
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
    console.timeEnd("create-many-" + many);
  }
  const countNamesIdx = await prisma.testNamesIndexed.count();

  if (countNamesIdx > 250_000) {
    console.time("countNamesIdx-many-" + 250_000);
    console.log({ countNamesIdx });
    console.timeEnd("countNamesIdx-many-" + 250_000);
  } else {
    console.time("create-countNamesIdx-" + many);
    /**
     * chunks of data
     * PS throws error
     * my guess: due to reaching data limits
     * @todo research
     */
    await seedTestNamesIdx(many);
    await seedTestNamesIdx(many);
    await seedTestNamesIdx(many);
    await seedTestNamesIdx(many);
    await seedTestNamesIdx(many);
    console.timeEnd("create-countNamesIdx-" + many);
  }

  // type opts = keyof prisma;
  many = 30_000;
  const countNamesCuid = await prisma.testNamesCuid.count();

  if (countNamesCuid > 250_000) {
    console.time("countNamesCuid-many-" + 250_000);
    console.log({ countNamesCuid });
    console.timeEnd("countNamesCuid-many-" + 250_000);
  } else {
    console.time("countNamesCuid-many-" + many);
    /**
     * chunks of data
     * PS throws error
     * my guess: due to reaching data limits
     * @todo research
     */
    await seedTestNamesCuid(many);
    await seedTestNamesCuid(many);
    await seedTestNamesCuid(many);
    await seedTestNamesCuid(many);
    await seedTestNamesCuid(many);
    await seedTestNamesCuid(many);
    await seedTestNamesCuid(many);
    await seedTestNamesCuid(many);
    await seedTestNamesCuid(many);
    console.timeEnd("countNamesCuid-many-" + many);
  }

  const countNamesCuidIdx = await prisma.testNamesCuidIndexed.count();

  if (countNamesCuidIdx > 250_000) {
    console.time("testNamesCuidIndexed-many-" + 250_000);
    console.log({ countNamesCuidIdx });
    console.timeEnd("testNamesCuidIndexed-many-" + 250_000);
  } else {
    console.time("testNamesCuidIndexed-many-" + many);
    /**
     * chunks of data
     * PS throws error
     * my guess: due to reaching data limits
     * @todo research
     */
    await seedTestNamesCuidIdx(many);
    await seedTestNamesCuidIdx(many);
    await seedTestNamesCuidIdx(many);
    await seedTestNamesCuidIdx(many);
    await seedTestNamesCuidIdx(many);
    await seedTestNamesCuidIdx(many);
    await seedTestNamesCuidIdx(many);
    await seedTestNamesCuidIdx(many);
    await seedTestNamesCuidIdx(many);
    console.timeEnd("testNamesCuidIndexed-many-" + many);
  }
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

  await prisma["testNames"].createMany({
    data: namesArray.map((name) => ({ name })),
    skipDuplicates: true,
  });

  console.log("Seeding completed!");
}

async function seedTestNamesCuid(many: number) {
  const names = new Set<string>();
  console.time("generate-many-" + many);
  while (names.size < many) {
    names.add(faker.internet.userName());
  }
  console.timeEnd("generate-many-" + many);

  console.time("spread-many-" + many);
  const namesArray = [...names];
  console.timeEnd("spread-many-" + many);

  await prisma.testNamesCuid.createMany({
    data: namesArray.map((name) => ({ name })),
    skipDuplicates: true,
  });

  console.log("Seeding completed!");
}
async function seedTestNamesIdx(many: number) {
  const names = new Set<string>();
  console.time("generate-NamesIdx-" + many);
  while (names.size < many) {
    names.add(faker.internet.userName());
  }
  console.timeEnd("generate-NamesIdx-" + many);

  console.time("spread-NamesIdx-" + many);
  const namesArray = [...names];
  console.timeEnd("spread-NamesIdx-" + many);

  await prisma.testNamesIndexed.createMany({
    data: namesArray.map((name) => ({ name })),
    skipDuplicates: true,
  });

  console.log("Seeding completed!");
}

async function seedTestNamesCuidIdx(many: number) {
  const names = new Set<string>();
  console.time("generate-NamesCuidIdx-" + many);
  while (names.size < many) {
    names.add(faker.internet.userName());
  }
  console.timeEnd("generate-NamesCuidIdx-" + many);

  console.time("spread-NamesCuidIdx-" + many);
  const namesArray = [...names];
  console.timeEnd("spread-NamesCuidIdx-" + many);

  await prisma.testNamesCuidIndexed.createMany({
    data: namesArray.map((name) => ({ name })),
    skipDuplicates: true,
  });

  console.log("Seeding completed!");
}
