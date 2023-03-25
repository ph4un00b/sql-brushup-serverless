import { Client } from "@planetscale/database";
import fetch from "node-fetch";
import { z } from "zod";
import { env } from "~/env.mjs";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

const db = new Client({
	fetch,
	host: env.DATABASE_HOST,
	username: env.DATABASE_USER,
	password: env.DATABASE_PASS,
});

async function sleep(ms: number) {
	return new Promise((res) => setTimeout(res, ms));
}

export const innerJoinRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	/**
	 * INNER JOIN
	 * @description
	 * -> loop
	 * 	-> loop
	 * 		-> merge
	 */
	join: publicProcedure.query(async () => {
		const queryStart = performance.now();
		const conn = db.connection();
		const { rows, time } = await conn.execute("SELECT * FROM User JOIN Cat;");
		const serverQueryTime = performance.now() - queryStart;
		await sleep(3000);
		console.log({ time, serverQueryTime });
		return { time, serverQueryTime, rows };
	}),

	/**
	 * INNER JOIN
	 * @description
	 * -> loop
	 * 	-> loop
	 * 		-> filter
	 *
	 * @summary
	 * Usually, the order of tables in a join doesn't matter
	 *
	 * In rare cases, your database engine may optimize a complex join badly,
	 * causing it to be slower than it could be.
	 * Reordering the join may help
	 *
	 * The second case is when there are duplicate column names.
	 *  When the joined tables have duplicate column names,
	 * the last table in the JOIN wins
	 */

	joinOn: publicProcedure.query(async () => {
		const queryStart = performance.now();
		const conn = db.connection();
		const { rows, time } = await conn.execute(
			`
			  SELECT
					User.email AS person,
					Cat.name AS cat
  			FROM User
  			JOIN Cat ON User.id = Cat.ownerId
			`,
		);
		const serverQueryTime = performance.now() - queryStart;
		await sleep(3000);
		console.log({ time, serverQueryTime });
		return { time, serverQueryTime, rows };
	}),
	joinOnWhere: publicProcedure.query(async () => {
		const queryStart = performance.now();
		const conn = db.connection();
		const { rows, time } = await conn.execute(
			`
			  SELECT
					User.email AS person,
					Cat.name AS cat
  			FROM User
  			JOIN Cat ON User.id = Cat.ownerId
				WHERE User.email = 'amir@gmail.com'
			`,
		);
		const serverQueryTime = performance.now() - queryStart;
		await sleep(3000);
		console.log({ time, serverQueryTime });
		return { time, serverQueryTime, rows };
	}),

	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
});
