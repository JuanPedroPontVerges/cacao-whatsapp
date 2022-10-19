// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { protectedExampleRouter } from "./protected-example-router";
import { userRouter } from "./user";
import { venueRouter } from "./venue";
import { categoryRouter } from "./category";
import { optionGroupRouter } from "./option-group";
import { optionRouter } from "./option";
import { displayTypeRouter } from "./display-type";
import { productRouter } from "./product";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", protectedExampleRouter)
  .merge("userRouter.", userRouter)
  .merge("venueRouter.", venueRouter)
  .merge("categoryRouter.", categoryRouter)
  .merge("optionGroupRouter.", optionGroupRouter)
  .merge("optionRouter.", optionRouter)
  .merge("displayTypeRouter.", displayTypeRouter)
  .merge("productRouter.", productRouter);


// export type definition of API
export type AppRouter = typeof appRouter;
