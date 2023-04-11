import { guestbookRouter } from "./routers/guestbook";
import { createTRPCRouter } from "~/server/api/trpc";
import { innerJoinRouter } from "~/server/api/routers/join";
import { indexesRouter } from "./routers/indexes";
import { advancedRouter } from "./routers/advanced";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  innerJoin: innerJoinRouter,
  indexes: indexesRouter,
  advanced: advancedRouter,
  guestbook: guestbookRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
