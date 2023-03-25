import { Client } from "@planetscale/database";
import fetch from "node-fetch";
import { z } from "zod";
import { env } from "~/env.mjs";

import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";

const db = new Client({
	fetch,
	host: env.DATABASE_HOST,
	username: env.DATABASE_USER,
	password: env.DATABASE_PASS
});

async function sleep(ms: number) {
	return new Promise(res => setTimeout(res, ms));
}

export const exampleRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	join: publicProcedure.query(async () => {
		const queryStart = performance.now();
		const conn = db.connection();
		const { rows, time } = await conn.execute("SELECT * FROM User JOIN Cat;");
		const serverQueryTime = performance.now() - queryStart;
		await sleep(3000);
		console.log({ time, serverQueryTime });
		return { time, serverQueryTime, rows };
	}),

	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
});
