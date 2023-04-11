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
export const advancedRouter = createTRPCRouter({
  indexTable: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `show index from CompositePeople;`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "100", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
});
