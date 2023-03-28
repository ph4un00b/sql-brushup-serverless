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
		if (enc("012345", 1) !== "135024") throw "bad!";

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

function enc(S: string) {
	const len = S.length;
	const res = new Array(S.length).fill("");
	// oeoeoe
	const middle = Math.floor(len / 2);

	// for (let index = 0; index < S.length; index++) {
	// 	const letra = S[index];
	// 	if (index % 2 == 0) {
	// 		res[middle] = letra;
	// 		middle++;
	// 	} else {
	// 		res[left] = letra;
	// 		left++;
	// 	}
	// }

	let par = middle;
	let impar = -1;

	const moves = new Array(S.length).fill(0);
	for (let index = 0; index < middle * 2; index++) {
		if (index % 2 === 0) {
			console.log(par);
			moves[index] = par;
			par--;
		} else {
			console.log(impar);
			moves[index] = impar;
			impar--;
		}
	}


	for (let index = 0; index < res.length; index++) {
		console.log({ index, m: moves[index], diff: moves[index] + index });
		res[moves[index]] = S[index];
	}

	// eeeooo
	console.log({ res, moves });
	return res.join("");
}

function dec(S: string) {

}
