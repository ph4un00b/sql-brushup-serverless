import {
  CompanyTable,
  CompositePeople,
  JoinBad,
  OrderTest,
  Prisma,
  PrismaClient,
  RandomTable,
  RentalsTest,
  UniqueData,
  UrlTest,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
async function main() {
  /**
   * @todo limit reseeding (on PS, up to 10M writes)
   * up to 100k for 100 reseeds!
   * up to 10k for 1k reseeds!
   * up to 1k for 10k reseeds!
   */

  const forRandomTable = [];
  for (let i = 1; i <= 20; i++) {
    const datum: Omit<RandomTable, "id"> = {
      size: 1000 + Math.floor(Math.random() * 30_000),
      title: faker.hacker.phrase(),
      dueDate: Math.random() > 0.5 ? faker.date.soon(10) : new Date(),
      dueTime: faker.date.soon(10),
    };
    forRandomTable.push(datum);
  }
  console.log({ forRandomTable });
  await prisma.randomTable.createMany({
    data: forRandomTable,
  });

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

  /**
   * composite index test
   */
  many = 10_000;
  const compositePeople = await prisma.compositePeople.count();

  if (compositePeople > 250_000) {
    console.time("compositePeople" + 250_000);
    console.log({ compositePeople });
    console.timeEnd("compositePeople" + 250_000);
  } else {
    console.time("compositePeople" + many);
    /**
     * chunks of data
     * PS throws error
     * my guess: due to reaching data limits
     * @todo research
     */
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);

    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    await seedCompositePeople(many);
    console.timeEnd("compositePeople" + many);
  }

  // const countCompositeNames = await prisma.compositePeople.count();

  // const forOrders = [];
  // for (let i = 1; i <= 200; i++) {
  //   const datum: Omit<OrderTest, "id"> = {
  //     customerId: BigInt(1 + Math.floor(Math.random() * countCompositeNames)),
  //     total: new Prisma.Decimal(1 + Math.random() * 1000),
  //   };
  //   forOrders.push(datum);
  // }
  // console.log({ forOrders });
  // await prisma.orderTest.createMany({
  //   data: forOrders,
  // });

  // const forCompany = [];
  // for (let i = 1; i <= 20; i++) {
  //   const datum: Omit<CompanyTable, "id"> = {
  //     name: faker.company.name(),
  //   };
  //   forCompany.push(datum);
  // }
  // console.log({ forCompany });
  // await prisma.companyTable.createMany({
  //   data: forCompany,
  //   skipDuplicates: true,
  // });

  // const countCompanyNames = await prisma.companyTable.count();

  // const forJoinTable = [];
  // for (let i = 1; i <= 1_500; i++) {
  //   const datum = {
  //     companyTableId: BigInt(1 + Math.floor(Math.random() * countCompanyNames)),
  //     peopleId: BigInt(1 + Math.floor(Math.random() * countCompositeNames)),
  //   };
  //   forJoinTable.push(datum);
  // }

  // // console.log({ forJoinTable });
  // await prisma.joinBad.createMany({
  //   data: forJoinTable,
  // });
  // await prisma.joinCool.createMany({
  //   data: forJoinTable,
  // });

  const forRentals = [];
  const startDate = new Date("2022-01-01");
  const endDate = new Date("2022-12-31");
  for (let i = 1; i <= 100; i++) {
    const datum: Omit<RentalsTest, "id"> = {
      rentalDate: new Date(
        startDate.getTime() +
          Math.random() * (endDate.getTime() - startDate.getTime()),
      ),
    };
    forRentals.push(datum);
  }
  console.log({ forRentals });
  await prisma.rentalsTest.createMany({
    data: forRentals,
    skipDuplicates: false,
  });

  // urls
  const forURLS = [];

  for (let i = 1; i <= 20; i++) {
    const datum: Omit<UrlTest, "id" | "urlMD5" | "urlBIN"> = {
      url: faker.commerce.product(),
    };
    forURLS.push(datum);
  }
  console.log({ forURLS });
  await prisma.urlTest.createMany({
    data: forURLS,
    skipDuplicates: false,
  });

  // unique-data
  const forUniqueData = [];

  for (let i = 1; i <= 20; i++) {
    const datum: Omit<UniqueData, "id" | "md5" | "specific"> = {
      first: faker.name.jobType(),
      secondary: faker.music.genre(),
      last: faker.hacker.verb(),
    };
    forUniqueData.push(datum);
  }
  console.log({ forUniqueData });
  await prisma.uniqueData.createMany({
    data: forUniqueData,
    skipDuplicates: false,
  });
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

function createRandomUser(): Omit<CompositePeople, "id"> {
  return {
    firstName: faker.internet.userName().slice(0, 2 + Math.random() * 4),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    birthday: faker.date.birthdate(),
    bio: faker.lorem.sentence(),
  };
}

async function seedCompositePeople(many: number) {
  const people = new Set<Omit<CompositePeople, "id">>();
  console.time("generate-CompositePeople-" + many);
  while (people.size < many) {
    people.add(createRandomUser());
  }
  console.timeEnd("generate-CompositePeople-" + many);

  console.time("spread-CompositePeople-" + many);
  const namesArray = [...people];
  console.timeEnd("spread-CompositePeople-" + many);

  await prisma.compositePeople.createMany({
    data: namesArray,
    skipDuplicates: true,
  });

  console.log("Seeding completed!");
}

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
