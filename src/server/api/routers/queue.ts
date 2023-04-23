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

// +----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+----------------+
// | id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra          |
// +----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+----------------+
// |  1 | SIMPLE      | QueueTest | NULL       | ALL  | NULL          | NULL | NULL    | NULL |   21 |   100.00 | Using filesort |
// +----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+----------------+
export const queueRouter = createTRPCRouter({
  get: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				SELECT * FROM QueueTest ORDER BY updatedAt DESC, id DESC LIMIT 6;
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "queue-get", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  /**
   * This query retrieves the most recent unclaimed row from the table.
   * However, it is important to note that this method is flawed,
   * as it does not guarantee that another worker has not already
   * claimed this row by the time our worker updates it.
   */
  available: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				SELECT
					*
				FROM
					QueueTest
				WHERE
					available = 1
				LIMIT 1;
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "queue-available", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  /**
   * @abstract
   * we are not using locking
   * in order to avoid race conditions!
   */
  // 		START TRANSACTION;
  // SELECT * FROM queue WHERE status = 'pending' ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED;
  // -- Update the status to "in progress" for the claimed row
  // UPDATE queue SET status = 'in progress' WHERE id = ?;
  // COMMIT;
  claiming: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				UPDATE QueueTest
				SET
					-- On your application side, you would need to make
					-- sure each worker process has a unique id. 
					owner = 9999, -- unique worker id
					available = 0,
					status = 'IN_PROGRESS'
				WHERE
					owner = 0
					AND
					available = 1
				LIMIT 1;
				`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "queue-claim", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
});
