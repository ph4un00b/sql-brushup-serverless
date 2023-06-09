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

export const issuesRouter = createTRPCRouter({
  history: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(`
				SELECT * from HistoryIssue
				order by id
				desc limit 6
				`);
      const serverQueryTime = performance.now() - queryStart;
      const out = { tag: "history", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  addHistory: publicProcedure
    .input(z.object({
      userId: z.string().uuid(),
      username: z.string(),
      productId: z.string().uuid(),
      product: z.string(),
    }))
    .mutation(async (opts) => {
      const { input } = opts;
      const { userId, username, productId, product } = input;
      // console.log(input);
      const conn = db.connection();
      await conn.execute(
        `
			INSERT INTO
				HistoryIssue (userId, username, productId, productName)
				VALUES (?, ?, ?, ?);
			`,
        [userId, username, productId, product],
      );
      return { data: "ok" };
    }),
  historySafe: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(`
				SELECT * from HistoryCompositePK
				order by createdAt
				desc limit 6
				`);
      const serverQueryTime = performance.now() - queryStart;
      const out = { tag: "history-safe", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  addHistorySafe: publicProcedure
    .input(z.object({
      userId: z.string().uuid(),
      username: z.string(),
      productId: z.string().uuid(),
      product: z.string(),
    }))
    .mutation(async (opts) => {
      const { input } = opts;
      const { userId, username, productId, product } = input;
      const conn = db.connection();

      try {
        await conn.execute(
          `
				INSERT INTO
				HistoryCompositePK (userId, username, productId, productName)
					VALUES (?, ?, ?, ?);
				`,
          [userId, username, productId, product],
        );
      } catch (error) {
        console.log(">>history-safe pos me como el errosito fome (●'◡'●)");
      }

      return { data: "ok" };
    }),
  historyUnique: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(`
				SELECT * from HistoryCompositeUnique
				order by id
				desc limit 6
				`);
      const serverQueryTime = performance.now() - queryStart;
      const out = { tag: "history-uniq", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  addHistoryUnique: publicProcedure
    .input(z.object({
      userId: z.string().uuid(),
      username: z.string(),
      productId: z.string().uuid(),
      product: z.string(),
    }))
    .mutation(async (opts) => {
      const { input } = opts;
      const { userId, username, productId, product } = input;
      const conn = db.connection();
      // since we ignore we don't need to deal with try-catches ༼ つ ◕_◕ ༽つ
      await conn.execute(
        `
				INSERT IGNORE INTO
				HistoryCompositeUnique (userId, username, productId, productName)
					VALUES (?, ?, ?, ?);
				`,
        [userId, username, productId, product],
      );

      return { data: "ok" };
    }),
});
