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

      const out = { tag: "bin", time, serverQueryTime };
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

      const out = { tag: "bin-explained", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  // 		+----+----------------+------------------+----------+------------+------------------------------------+
  // | id | first          | secondary        | specific | last       | md5                                |
  // +----+----------------+------------------+----------+------------+------------------------------------+
  // | 13 | Architect      | Non Music        | NULL     | generate   | 0xEA20063CD344B81B613DB901FF34D3FC |
  // | 14 | Administrator  | Blues            | NULL     | reboot     | 0x474AB48DC55F4565347E37C423F208E5 |
  // | 15 | Assistant      | Funk             | NULL     | synthesize | 0x6B40C53B344A0BE7DD2361044EBB61DD |
  // | 16 | Assistant      | Hip Hop          | NULL     | hack       | 0x34C30EB4C07B50B52BE34336D7AE42D3 |
  // | 17 | Specialist     | Pop              | NULL     | program    | 0x5C7B09ACF6FC7401F72B550A4E9D9374 |
  // | 18 | Architect      | Stage And Screen | NULL     | override   | 0xEF65DABD8433D076DAFD5600F87BD185 |
  // | 19 | Specialist     | Funk             | NULL     | hack       | 0x1D7086188402E62FD56FCAD93D6C10E8 |
  // | 20 | Coordinator    | Pop              | NULL     | reboot     | 0x8B450065B5037E0AE5F63160EF5FA62E |

  complexMD5: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
				select * from UniqueData where md5 = unhex(md5(concat_ws("|", "Coordinator", "Pop", "reboot")));
			`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "complexMD5", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
  // +----+-------------+------------+------------+-------+--------------------+--------------------+---------+-------+------+----------+-------+
  // | id | select_type | table      | partitions | type  | possible_keys      | key                | key_len | ref   | rows | filtered | Extra |
  // +----+-------------+------------+------------+-------+--------------------+--------------------+---------+-------+------+----------+-------+
  // |  1 | SIMPLE      | UniqueData | NULL       | const | UniqueData_md5_key | UniqueData_md5_key | 17      | const |    1 |   100.00 | NULL  |
  // +----+-------------+------------+------------+-------+--------------------+--------------------+---------+-------+------+----------+-------+
  complexMD5Exp: publicProcedure
    .query(async () => {
      const queryStart = performance.now();
      const conn = db.connection();
      const { rows, time } = await conn.execute(
        `
			EXPLAIN select * from UniqueData where md5 = unhex(md5(concat_ws("|", "Coordinator", "Pop", "reboot")));
			`,
      );
      const serverQueryTime = performance.now() - queryStart;

      const out = { tag: "complexMD5-explained", time, serverQueryTime };
      console.log(out);
      return { ...out, rows };
    }),
});
