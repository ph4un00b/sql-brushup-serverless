import { Client } from "@planetscale/database";
import fetch from "node-fetch";
import { z } from "zod";
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

// +----+-------------+-----------------+------------+------+---------------+------+---------+------+--------+----------+----------------+
// | id | select_type | table           | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra          |
// +----+-------------+-----------------+------------+------+---------------+------+---------+------+--------+----------+----------------+
// |  1 | SIMPLE      | CompositePeople | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 261344 |   100.00 | Using filesort |
// +----+-------------+-----------------+------------+------+---------------+------+---------+------+--------+----------+----------------+
export const paginationRouter = createTRPCRouter({
  /**
   * @abstract
   *
   * direct addressable pages: 			| ✅
   * simplicity: 										| ✅
   * handle shifting records: 			| ❌
   * deep pagination performance: 	| ❌ 1000ms
   */
  get: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				SELECT
					*
				FROM
					CompositePeople
				ORDER BY
					birthday,
					id
				LIMIT 10
				OFFSET 20000;
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "pagination-get", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  offset: publicProcedure
    /**
     * @see https://trpc.io/docs/reactjs/useinfinitequery
     */
    .input(z.object({
      limit: z.number().min(1).max(100),
      // "cursor" needs to exist, but can be any type
      cursor: z.number().nullish().default(20_000),
    }))
    .query(async ({ input }) => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				SELECT
					*
				FROM
					CompositePeople
				ORDER BY
					birthday,
					id
				LIMIT ?
				OFFSET ?;
				`,
        [input.limit + 1, input.cursor],
      );
      const serverQueryTime = performance.now() - queryStart;

      let next = undefined;
      if (rows.length > input.limit && input.cursor) {
        // next = rows.pop();
        next = 1 + input.cursor + input.limit;
      }

      console.log({ next });

      const out = { tag: "pagination-offset", time, serverQueryTime };
      console.log(out);
      return { ...out, rows, next };
    }),
});
