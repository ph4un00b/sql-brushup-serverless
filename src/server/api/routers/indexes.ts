import { Client } from "@planetscale/database";
import fetch from "node-fetch";
import { z } from "zod";
import { QData } from "~/components/tablita";
import { env } from "~/env.mjs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const db = new Client({
  fetch,
  host: env.DATABASE_HOST,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASS,
});

async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * INDEXES
 * @see https://dev.mysql.com/doc/refman/8.0/en/mysql-indexes.html
 */
export const indexesRouter = createTRPCRouter({
  q100: publicProcedure
    .query(async ({ input }) => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        "SELECT names_100.name FROM names_100 where names_100.name = 'hzcpodx'",
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "100", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  q1k: publicProcedure
    .query(async ({ input }) => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        "SELECT names_1k.name FROM names_1k where names_1k.name = '20580f3c'",
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "1k", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  q10k: publicProcedure
    .query(async ({ input }) => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        "SELECT names_10k.name FROM names_10k where names_10k.name = '095ec8ac'",
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "10k", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  q50k: publicProcedure
    // .output(
    //   z.object({
    //     rows: z.array(z.any()),
    //     tag: z.string(),
    //     time: z.number(),
    //     serverQueryTime: z.number(),
    //     info: z.array(z.object({
    //       cardinality: z.string(),
    //       total: z.string(),
    //       selectivity: z.string(),
    //     })),
    //   }),
    // )
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { time } = await conn.execute(
        // | 50001 | 73b2dc65 |
        "SELECT names_50k.name FROM names_50k where names_50k.name = '73b2dc65'",
      );
      const serverQueryTime = performance.now() - queryStart;

      const { rows } = await conn.execute(
        // | 50001 | 73b2dc65 |
        "explain select count(*) from names_50k",
      );

      const { rows: info } = await conn.execute(
        // | 50001 | 73b2dc65 |
        `
				select
				count(distinct name) as cardinality,
				count(*) as total,
				count(distinct name) / count(*) as selectivity from names_50k
				`,
      );
      // explain select count(*) from names_50
      const out = { tag: "50k", time, serverQueryTime, info };
      console.log(out);
      return { ...out, rows } as QData;
    }),
  q500k: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();

      console.time("q500k-where");
      const { time } = await conn.execute(
        //   select * from TestNames where id = 250000;
        "SELECT TestNames.name FROM TestNames where TestNames.name = 'Trystan65'",
      );
      console.timeEnd("q500k-where");
      const serverQueryTime = performance.now() - queryStart;

      console.time("q500k-explain");
      const { rows } = await conn.execute(
        //   select * from TestNames where id = 250000;
        "explain select count(*) from TestNames",
      );
      console.timeEnd("q500k-explain");

      console.time("q500k-count");
      const { rows: info } = await conn.execute(
        //   select * from TestNames where id = 250000;
        `
				select
				count(distinct name) as cardinality,
				count(*) as total,
				count(distinct name) / count(*) as selectivity from TestNames
				`,
      );
      console.timeEnd("q500k-count");

      const out = { tag: "500k", time, serverQueryTime, info };
      console.log(out);
      return { ...out, rows } as QData;
    }),
  q500kIdx: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();

      console.time("q500k-idx-where");
      const { time } = await conn.execute(
        //  select * from TestNames where id = 500000;
        "SELECT TestNamesIndexed.name FROM TestNamesIndexed where TestNamesIndexed.name = 'Raegan.Heidenreich'",
      );
      console.timeEnd("q500k-idx-where");
      const serverQueryTime = performance.now() - queryStart;

      console.time("q500k-idx-explain");
      const { rows } = await conn.execute(
        //  select * from TestNamesIndexed where id = 500000;
        "explain select count(*) from TestNamesIndexed",
      );
      console.timeEnd("q500k-idx-explain");

      console.time("q500k-idx-count");
      const { rows: info } = await conn.execute(
        //  select * from TestNamesIndexed where id = 500000;
        `
				select
				count(distinct name) as cardinality,
				count(*) as total,
				count(distinct name) / count(*) as selectivity from TestNamesIndexed
				`,
      );
      console.timeEnd("q500k-idx-count");

      const out = { tag: "q500k-idx", time, serverQueryTime, info };
      console.log(out);
      return { ...out, rows } as QData;
    }),
  q500kCuid: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();

      console.time("q500kCuid-where");
      const { time } = await conn.execute(
        //  select * from TestNamesCuid limit 10 offset 500000;
        //  clg7kvaj75cwsw3gkcc8pyby9 | Reece_Grant58
        "SELECT TestNamesCuid.name FROM TestNamesCuid where TestNamesCuid.name = 'Reece_Grant58'",
      );
      console.timeEnd("q500kCuid-where");

      const serverQueryTime = performance.now() - queryStart;

      console.time("q500kCuid-explain");
      const { rows } = await conn.execute(
        //  select * from TestNamesCuid limit 10 offset 500000;
        //  clg7kvaj75cwsw3gkcc8pyby9 | Reece_Grant58
        "explain select count(*) from TestNamesCuid",
      );
      console.timeEnd("q500kCuid-explain");

      console.time("q500kCuid-count");
      const { rows: info } = await conn.execute(
        //  select * from TestNamesCuid limit 10 offset 500000;
        //  clg7kvaj75cwsw3gkcc8pyby9 | Reece_Grant58
        `
				select
				count(distinct name) as cardinality,
				count(*) as total,
				count(distinct name) / count(*) as selectivity from TestNamesCuid
				`,
      );
      console.timeEnd("q500kCuid-count");

      const out = { tag: "q500kCuid-cuid", time, serverQueryTime, info };
      console.log(out);
      return { ...out, rows } as QData;
    }),
  q500kCuidIdx: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();

      console.time("q500kCuidIdx-where");
      const { time } = await conn.execute(
        //  select * from TestNamesCuidIndexed limit 10 offset 500000;
        //  | clg7kvmtu8d09w3gkchnowddb | Tiana_Zboncak     |
        "SELECT TestNamesCuidIndexed.name FROM TestNamesCuidIndexed where TestNamesCuidIndexed.name = 'Tiana_Zboncak'",
      );
      console.timeEnd("q500kCuidIdx-where");

      const serverQueryTime = performance.now() - queryStart;

      console.time("q500kCuidIdx-explain");
      const { rows } = await conn.execute(
        //  select * from TestNamesCuidIndexed limit 10 offset 500000;
        //  | clg7kvmtu8d09w3gkchnowddb | Tiana_Zboncak     |
        "explain select count(*) from TestNamesCuidIndexed",
      );
      console.timeEnd("q500kCuidIdx-explain");

      console.time("q500kCuidIdx-count");
      const { rows: info } = await conn.execute(
        //  select * from TestNamesCuidIndexed limit 10 offset 500000;
        //  | clg7kvmtu8d09w3gkchnowddb | Tiana_Zboncak     |
        `
				select
				count(distinct name) as cardinality,
				count(*) as total,
				count(distinct name) / count(*) as selectivity from TestNamesCuidIndexed
				`,
      );
      console.timeEnd("q500kCuidIdx-count");

      const out = { tag: "q500kCuidIdx-cuid", time, serverQueryTime, info };
      console.log(out);
      return { ...out, rows } as QData;
    }),
});
