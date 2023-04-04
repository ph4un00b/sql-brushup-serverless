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
      await sleep(3000);

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
      await sleep(3000);

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
      await sleep(3000);

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
      await sleep(3000);

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
});
