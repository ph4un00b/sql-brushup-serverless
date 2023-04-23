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

// +----+-------------+-------------+------------+------+---------------+------+---------+------+------+----------+----------------+
// | id | select_type | table       | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra          |
// +----+-------------+-------------+------------+------+---------------+------+---------+------+------+----------+----------------+
// |  1 | SIMPLE      | PaymentTest | NULL       | ALL  | NULL          | NULL | NULL    | NULL |   20 |   100.00 | Using filesort |
// +----+-------------+-------------+------------+------+---------------+------+---------+------+------+----------+----------------+
export const sumRouter = createTRPCRouter({
  get: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				SELECT * FROM PaymentTest ORDER BY paymentDate DESC, id DESC LIMIT 6;
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "sum-get", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  // +----+-------------+-------------+------------+------+---------------+------+---------+------+------+----------+-----------------------------+
  // | id | select_type | table       | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra                       |
  // +----+-------------+-------------+------------+------+---------------+------+---------+------+------+----------+-----------------------------+
  // |  1 | SIMPLE      | PaymentTest | NULL       | ALL  | NULL          | NULL | NULL    | NULL |   20 |    33.33 | Using where; Using filesort |
  // +----+-------------+-------------+------------+------+---------------+------+---------+------+------+----------+-----------------------------+
  filtering: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				SELECT
					amount,
					YEAR(paymentDate),
					MONTH(paymentDate),
					ROW_NUMBER() OVER (PARTITION BY YEAR(paymentDate)) AS num
				FROM
					PaymentTest
				WHERE
					-- This is a SQL query that formats the current date to display
					-- only the year and month, with the day set to 01.
					-- if the current date is April 23, 2023,
					-- the query would return "2023-04-01".

					paymentDate < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
				LIMIT 6
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "sum-filter", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  grouping: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				SELECT
					sum(amount) as amount,
					YEAR(paymentDate) as year,
					ROW_NUMBER() OVER (PARTITION BY YEAR(paymentDate)) AS num
				FROM
					PaymentTest
				WHERE
					paymentDate < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
				GROUP BY
					year
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "sum-group", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  populate: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				INSERT IGNORE INTO PaymentSummary (amount, year)
				SELECT
					sum(amount) as amount,
					YEAR(paymentDate) as year
				FROM
					PaymentTest
				WHERE
					paymentDate < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
				GROUP BY
					year
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "sum-populate", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  live: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				SELECT
					amount,
					year
				FROM
					PaymentSummary

				UNION ALL

				SELECT
					SUM(amount) AS amount,
					YEAR(paymentDate) AS year
				FROM
					PaymentTest
				WHERE
					paymentDate >= DATE_FORMAT('2023-01-01', '%Y-%m-%d')
				GROUP BY
					YEAR(paymentDate)
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "sum-live", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  // common table expression (CTE)
  // not supported on ps by now
  // will throw
  cte: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				WITH payment_data AS (
					SELECT
						amount,
						year
					FROM
						PaymentSummary

					UNION ALL

					SELECT
						SUM(amount) AS amount,
						YEAR(paymentDate) AS year
					FROM
						PaymentTest
					WHERE
						paymentDate >= DATE_FORMAT('2023-01-01', '%Y-%m-%d')
					GROUP BY
						YEAR(paymentDate)
				)

				SELECT * FROM payment_data
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "sum-cte", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
});
