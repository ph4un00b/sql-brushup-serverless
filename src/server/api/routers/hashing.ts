import { Client } from "@planetscale/database";
import fetch from "node-fetch";
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

export const hashingRouter = createTRPCRouter({
  normal: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				SELECT * FROM UrlTest WHERE url = 'Mouse';
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "no-hash", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  normalExp: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				EXPLAIN SELECT * FROM UrlTest WHERE url = 'Mouse';
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "no-hash-explained", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  md5: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				SELECT * FROM UrlTest WHERE urlMD5 = MD5('Mouse');
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "md5", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  md5Exp: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				EXPLAIN SELECT * FROM UrlTest WHERE urlMD5 = MD5('Mouse');
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "md5-explained", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  bin: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				SELECT * FROM UrlTest WHERE urlBIN = UNHEX(MD5('Mouse'));
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "md5", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  /**
   * @see https://dev.mysql.com/doc/refman/8.0/en/encryption-functions.html
   */
  binExp: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				EXPLAIN SELECT * FROM UrlTest WHERE urlBIN = UNHEX(MD5('Mouse'));
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "md5-explained", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
});
