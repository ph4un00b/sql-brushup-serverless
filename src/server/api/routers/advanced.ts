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
  partial: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        // select * from CompositePeople where id = 250000;
        // 250000 | Er        | Davion34 | 1958-01-02 | Rudolph_Block@yahoo.com
        `
				EXPLAIN
				SELECT * FROM CompositePeople
				WHERE firstName = 'Er'
				AND lastName = 'Davion34'
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "first-index", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  full: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        // select * from CompositePeople where id = 250000;
        // 250000 | Er        | Davion34 | 1958-01-02 | Rudolph_Block@yahoo.com
        `
				EXPLAIN
				SELECT * FROM CompositePeople
				WHERE firstName = 'Er'
				AND lastName = 'Davion34'
				AND birthday = '1958-01-02'
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "2-index", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  skipIndex: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        // select * from CompositePeople where id = 250000;
        // 250000 | Er        | Davion34 | 1958-01-02 | Rudolph_Block@yahoo.com
        `
				EXPLAIN
				SELECT * FROM CompositePeople
				WHERE firstName = 'Er'
				AND birthday = '1958-01-02'
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "skip", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  avoidIndex: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        // select * from CompositePeople where id = 250000;
        // 250000 | Er        | Davion34 | 1958-01-02 | Rudolph_Block@yahoo.com
        `
				EXPLAIN
				SELECT * FROM CompositePeople
				WHERE lastName = 'Davion34'
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "avoid", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  range: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        // select * from CompositePeople where id = 250000;
        // 250000 | Er        | Davion34 | 1958-01-02 | Rudolph_Block@yahoo.com
        `
				EXPLAIN
				SELECT * FROM CompositePeople
				WHERE firstName = 'Er'
				AND lastName < 'Davion34'
				AND birthday = '1958-01-02'
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "range", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),

  /**
   * COVERING INDEXES
   *
   * When a query is executed, the engine traverses
   *  the B-tree to find the required rows and then
   * follows the pointer to fetch the corresponding
   *  rows from the clustered index. However, with
   *  a covering index, the engine can retrieve all
   *  the data it needs from the secondary index itself,
   *  without having to access the clustered index.
   */
  coveringIndex: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        // select * from CompositePeople where id = 250000;
        // 250000 | Er        | Davion34 | 1958-01-02 | Rudolph_Block@yahoo.com
        `
				EXPLAIN
				SELECT id, firstName, birthday FROM CompositePeople
				WHERE firstName = 'Er'
				AND lastName = 'Davion34'
				AND birthday = '1958-01-02'
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "covering", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  noCovering: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        // select * from CompositePeople where id = 250000;
        // 250000 | Er        | Davion34 | 1958-01-02 | Rudolph_Block@yahoo.com
        `
				EXPLAIN
				SELECT id, firstName, birthday, email FROM CompositePeople
				WHERE firstName = 'Er'
				AND lastName = 'Davion34'
				AND birthday = '1958-01-02'
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "no-covering", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
});
