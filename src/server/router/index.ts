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
import { productStoreToOptionGroupRouter } from "./product-store-to-option-group";
import { productOptionRouter } from "./product-option";
import { storeRouter } from "./store";
import { productStoreCartRouter } from "./product-store-cart";
import { productStoreCartToOptionRouter } from "./product-store-cart-to-option";
import { cartRouter } from "./cart";
import { paymentTypeRouter } from "./payment-type";
import { orderRouter } from "./order";
import { customerRouter } from "./customer";
import { paymentRouter } from "./payment";
import { orderStateRouter } from "./order-state";
import { reportRouter } from "./report";
import { menuSettingRouter } from "./menuSetting";
import { scheduleRouter } from "./schedule";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", protectedExampleRouter)
  .merge("userRouter.", userRouter)
  .merge("venueRouter.", venueRouter)
  .merge("categoryRouter.", categoryRouter)
  .merge("optionGroupRouter.", optionGroupRouter)
  .merge("optionRouter.", optionRouter)
  .merge("displayTypeRouter.", displayTypeRouter)
  .merge("productRouter.", productRouter)
  .merge("productStoreToOptionGroupRouter.", productStoreToOptionGroupRouter)
  .merge("productOptionRouter.", productOptionRouter)
  .merge("storeRouter.", storeRouter)
  .merge("productStoreCartRouter.", productStoreCartRouter)
  .merge("productStoreCartToOptionRouter.", productStoreCartToOptionRouter)
  .merge("cartRouter.", cartRouter)
  .merge("paymentTypeRouter.", paymentTypeRouter)
  .merge("orderRouter.", orderRouter)
  .merge("customerRouter.", customerRouter)
  .merge("paymentRouter.", paymentRouter)
  .merge("orderStateRouter.", orderStateRouter)
  .merge("reportRouter.", reportRouter)
  .merge("menuSettingRouter.", menuSettingRouter)
  .merge("scheduleRouter.", scheduleRouter);

  


// export type definition of API
export type AppRouter = typeof appRouter;
