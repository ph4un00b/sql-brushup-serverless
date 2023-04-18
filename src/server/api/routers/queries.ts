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
  suboptimal: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				explain select *
					from RandomTable
				where
					ADDTIME(dueDate, dueTime) between now()
				and
					now() + interval 2 day
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "suboptimal", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  optimal: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				explain select *
				 from RandomTable
				where
					dueDate between current_date
				and
				 	current_date + interval 2 day
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "optimal", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  redundant: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				explain select *
				 from RandomTable
				where
					ADDTIME(dueDate, dueTime) between now()
				and
					now() + interval 2 day
				-- using redundant data with false positives then narrow it
				-- in order to get all positive data
				AND
					dueDate between current_date
				and
				 	current_date + interval 2 day
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "redundant", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  pivotBad: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				explain format=tree
				-- explain
				SELECT
					CompanyTable.name, CompositePeople.email
				FROM CompanyTable
					LEFT JOIN JoinBad ON JoinBad.companyTableId = CompanyTable.id
					LEFT JOIN CompositePeople ON CompositePeople.id = JoinBad.peopleId
				WHERE
					CompanyTable.id <= 15
				-- LIMIT 10
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "pivot-bad", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  pivotCool: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				explain format=tree
				-- explain
				SELECT
					CompanyTable.name, CompositePeople.email
				FROM CompanyTable
					LEFT JOIN JoinCool ON JoinCool.companyTableId = CompanyTable.id
					LEFT JOIN CompositePeople ON CompositePeople.id = JoinCool.peopleId
				WHERE
					CompanyTable.id <= 15
				-- LIMIT 10
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "pivot-cool", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  subqueryBad: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				explain format=tree
				SELECT
				DISTINCT
					CompositePeople.firstName, CompositePeople.lastName
				FROM
					CompositePeople
					INNER JOIN OrderTest ON CompositePeople.id = OrderTest.customerId
				WHERE
					CompositePeople.firstName = 'al'
				and
					OrderTest.total	 > 599
				order by
					CompositePeople.firstName
				asc
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "subquery-bad", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  subqueryCool: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				explain format=tree
				SELECT * FROM CompositePeople
				WHERE
					id IN (
						SELECT customerId FROM OrderTest
						WHERE total > 599
					)
				AND
					CompositePeople.firstName = 'al'
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "subquery-cool", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
});
