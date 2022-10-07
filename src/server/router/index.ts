// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { protectedExampleRouter } from "./protected-example-router";
import { userRouter } from "./user";
import { venueRouter } from "./venue";
import { categoryRouter } from "./category";
import { optionGroupRouter } from "./option-group";
import { optionRouter } from "./option";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", protectedExampleRouter)
  .merge("userRouter.", userRouter)
  .merge("venueRouter.", venueRouter)
  .merge("categoryRouter.", categoryRouter)
  .merge("optionGroupRouter.", optionGroupRouter)
  .merge("optionRouter.", optionRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
