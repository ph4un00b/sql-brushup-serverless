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
   * offset pagination
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
  // +----+-------------+-----------------+------------+-------+----------------+--------+---------+------+--------+----------+-----------------------+
  // | id | select_type | table           | partitions | type  | possible_keys  | key    | key_len | ref  | rows   | filtered | Extra                 |
  // +----+-------------+-----------------+------------+-------+----------------+--------+---------+------+--------+----------+-----------------------+
  // |  1 | SIMPLE      | CompositePeople | NULL       | range | PRIMARY,nacido | nacido | 11      | NULL | 130672 |    50.00 | Using index condition |
  // +----+-------------+-----------------+------------+-------+----------------+--------+---------+------+--------+----------+-----------------------+
  badCursor: publicProcedure
    /**
     * cursor pagination
     * @abstract
     *
     * direct addressable pages: 			| ❌
     * simplicity: 										| ❌
     * handle shifting records: 			| ✅
     * deep pagination performance: 	| ✅ 250ms
     */
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
			SELECT
				*
			FROM
				CompositePeople
			WHERE
				id > 186681
				AND
				birthday >= '1947-08-30'
			ORDER BY
				birthday,
				id
			LIMIT 10
			`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "pagination-bad-cursor", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  bestCursor: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100),
      // "cursor" needs to exist, but can be any type
      cursor: z.object({
        id: z.number(),
        birthday: z.string(),
      }),
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
			WHERE
				-- maybe early id's could match!
				birthday > ?
				OR
				(birthday = ? AND id > ?)
			ORDER BY
				birthday,
				id
			LIMIT ?
			`,
        [
          input.cursor.birthday,
          input.cursor.birthday,
          input.cursor.id,
          input.limit + 1,
        ],
      );
      const serverQueryTime = performance.now() - queryStart;

      let next: typeof input.cursor | undefined = undefined;
      if (rows.length > input.limit) {
        // console.log({ rows });
        rows.pop();
        const last = rows.slice().pop();
        if (last) {
          // @ts-ignore
          next = { id: Number(last?.id), birthday: last?.birthday };
        }
      }

      console.log({ next });

      const out = { tag: "pagination-best-cursor", time, serverQueryTime };
      console.log(out);
      return { ...out, rows, next };
    }),
  // +----+-------------+-----------------+------------+--------+---------------+---------+---------+--------+-------+----------+---------------------------------+
  // | id | select_type | table           | partitions | type   | possible_keys | key     | key_len | ref    | rows  | filtered | Extra                           |
  // +----+-------------+-----------------+------------+--------+---------------+---------+---------+--------+-------+----------+---------------------------------+
  // |  1 | PRIMARY     | <derived2>      | NULL       | ALL    | NULL          | NULL    | NULL    | NULL   | 20010 |   100.00 | Using temporary; Using filesort |
  // |  1 | PRIMARY     | cp1             | NULL       | eq_ref | PRIMARY       | PRIMARY | 8       | cp2.id |     1 |   100.00 | NULL                            |
  // |  2 | DERIVED     | CompositePeople | NULL       | index  | NULL          | nacido  | 3       | NULL   | 20010 |   100.00 | Using index                     |
  // +----+-------------+-----------------+------------+--------+---------------+---------+---------+--------+-------+----------+---------------------------------+
  deferredJoin: publicProcedure
    /**
     * cursor pagination
     * @abstract
     *
     * direct addressable pages: 			| ✅
     * simplicity: 										| ✅
     * handle shifting records: 			| ❌
     * deep pagination performance: 	| 🆗 250-500ms
     */
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				SELECT * FROM CompositePeople AS cp1
				INNER JOIN (
					SELECT id FROM CompositePeople ORDER BY birthday, id LIMIT 10 OFFSET 20000
				) AS cp2 ON cp1.id = cp2.id
				ORDER BY
					cp1.birthday, cp1.id
			`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "pagination-deferred", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
});
