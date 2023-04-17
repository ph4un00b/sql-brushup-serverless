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

export const queriesRouter = createTRPCRouter({
  formatTree: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				EXPLAIN format=tree
				SELECT * FROM CompositePeople
				WHERE firstName = 'fau'
				ORDER BY id DESC
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "format-tree", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  formatJson: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				EXPLAIN format=json
				SELECT * FROM CompositePeople
				WHERE
					MATCH(firstName, lastName, bio)
					AGAINST ('+fau -Pfannerstill' IN BOOLEAN MODE)
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "format-json", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  analyze: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				EXPLAIN ANALYZE
				SELECT * FROM CompositePeople
				WHERE
					MATCH(firstName, lastName, bio)
					AGAINST ('+fau -Pfannerstill' IN BOOLEAN MODE)
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "analyze", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  obfuscated: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				EXPLAIN SELECT * from RandomTable WHERE size / 2 < 15000;
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "obfuscated", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  deobfuscated: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				EXPLAIN SELECT * from RandomTable WHERE size < 15000 / 2;
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "deobfuscated", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
});
