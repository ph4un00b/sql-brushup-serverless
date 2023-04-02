import { Client } from "@planetscale/database";
import fetch from "node-fetch";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
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

		const out = { tag: "join", time, serverQueryTime };
		console.log(out);
		return { ...out, rows };
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

		const out = { tag: "join-on", time, serverQueryTime };
		console.log(out);
		return { ...out, rows };
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

		const out = { tag: "join-on-where", time, serverQueryTime };
		console.log(out);
		return { ...out, rows };
	}),
	/**
	 * LEFT JOIN
	 * @description
	 *
	 * -> loop user:
	 *	-> loop discount:
	 *		-> filter user matches + no matches:
	 */
	leftJoin: publicProcedure.query(async () => {
		const queryStart = performance.now();
		const conn = db.connection();
		const { rows, time } = await conn.execute(
			`
			SELECT
				User.name AS name,
				Discount.discountCode AS discount_code
			FROM User LEFT JOIN Discount
				ON User.discountId = Discount.id
			`,
		);
		const serverQueryTime = performance.now() - queryStart;
		await sleep(3000);

		const out = { tag: "left-join", time, serverQueryTime };
		console.log(out);
		return { ...out, rows };
	}),
	joinN1: publicProcedure.query(async () => {
		const { rows, serverQueryTime } = await peopleAndCats();
		await sleep(3000);

		const out = { tag: "join-n+1", serverQueryTime };
		console.log(out);
		return { ...out, rows };
	}),
	joinN1_2Q: publicProcedure.query(async () => {
		const { rows, serverQueryTime } = await peopleAndCats2Queries();
		await sleep(3000);

		const out = { tag: "join-n+1-2-queries", serverQueryTime };
		console.log(out);
		return { ...out, rows };
	}),
	ignore: publicProcedure.query(async () => {
		const queryStart = performance.now();
		const conn = db.connection();
		const { rows, time } = await conn.execute(`
			INSERT IGNORE INTO Vaccination (cat_name) VALUES ('Ms. Fluff')
			`);
		const serverQueryTime = performance.now() - queryStart;
		await sleep(3000);

		const out = { tag: "ignore", time, serverQueryTime };
		console.log(out);
		return { ...out, rows };
	}),
	notIgnore: publicProcedure.query(async () => {
		const queryStart = performance.now();
		const conn = db.connection();
		try {
			// eslint-disable-next-line no-var
			var { rows, time } = await conn.execute(`
				INSERT INTO Vaccination (cat_name) VALUES ('Ms. Fluff')
				`);
		} catch (error) {
			const serverQueryTime = performance.now() - queryStart;
			const out = { tag: "not-ignore", serverQueryTime };
			console.log(out);
			return { ...out, rows: [] };
		}
		const serverQueryTime = performance.now() - queryStart;
		await sleep(3000);

		const out = { tag: "not-ignore", time, serverQueryTime };
		console.log(out);
		return { ...out, rows };
	}),
	virtual: publicProcedure.query(async () => {
		const queryStart = performance.now();
		const conn = db.connection();
		const { rows, time } = await conn.execute(`
			SELECT email_quoted, domain_virtual from json_test;
			`);
		const serverQueryTime = performance.now() - queryStart;
		await sleep(3000);

		const out = { tag: "computed virtual", time, serverQueryTime };
		console.log(out);
		return { ...out, rows };
	}),
	stored: publicProcedure.query(async () => {
		const queryStart = performance.now();
		const conn = db.connection();
		const { rows, time } = await conn.execute(`
			SELECT email_unquoted, domain_stored from json_test;
			`);
		const serverQueryTime = performance.now() - queryStart;
		await sleep(3000);

		const out = { tag: "computed stored", time, serverQueryTime };
		console.log(out);
		return { ...out, rows };
	}),
	onConflict: publicProcedure.query(async () => {
		const queryStart = performance.now();
		const conn = db.connection();
		try {
			// eslint-disable-next-line no-var
			var { rows, time } = await conn.execute(
				`
			INSERT INTO Visit (id, email, count) VALUES (?, 'jamon@jamon.com', 1);
			`,
				[createId()],
			);
		} catch (error) {
			const serverQueryTime = performance.now() - queryStart;
			const out = { tag: "on-conflict", serverQueryTime };
			console.log(out);
			return { ...out, rows: [] };
		}
		const serverQueryTime = performance.now() - queryStart;
		await sleep(3000);

		const out = { tag: "on-conflict", time, serverQueryTime };
		console.log(out);
		return { ...out, rows };
	}),
	doUpdate: publicProcedure.query(async () => {
		const queryStart = performance.now();
		const conn = db.connection();
		const { rows, time } = await conn.execute(`
			INSERT INTO Visit (id, email, count) VALUES (?, 'jamon@jamon.com', 1)
      	ON DUPLICATE KEY UPDATE count = count + 1;
			`, [createId()]);
		const serverQueryTime = performance.now() - queryStart;
		await sleep(3000);

		const out = { tag: "do-update", time, serverQueryTime };
		console.log(out);
		return { ...out, rows };
	}),

	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
});

async function peopleAndCats2Queries() {
	const queryStart = performance.now();
	const conn = db.connection();
	const results = [];
	const { rows: people } = await conn.execute("SELECT * FROM User");
	const { rows: cats } = await conn.execute("SELECT * FROM Cat");
	for (const person of people) {
		for (const cat of cats) {
			if (cat.ownerId === person.id) {
				results.push({ person: person.name, cat: cat.name });
			}
		}
	}
	const serverQueryTime = performance.now() - queryStart;
	return { rows: results, serverQueryTime };
}

async function peopleAndCats() {
	const queryStart = performance.now();
	const conn = db.connection();
	const results = [];
	const { rows: people } = await conn.execute("SELECT * FROM User");
	for (const person of people) {
		const { rows: catsOwnedByPerson } = await conn.execute(
			"SELECT * FROM Cat WHERE Cat.ownerId = ?",
			[person.id],
		);

		for (const cat of catsOwnedByPerson) {
			results.push({ person: person.name, cat: cat.name });
		}
	}
	const serverQueryTime = performance.now() - queryStart;
	return { rows: results, serverQueryTime };
}
