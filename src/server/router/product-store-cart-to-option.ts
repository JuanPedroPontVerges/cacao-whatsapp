import { z } from "zod";
import { createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const productStoreCartToOptionRouter = createRouter()
  .mutation("create", {
    input: z.object({
      amount: z.number(),
      productStoreCartId: z.string(),
      optionId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { amount, productStoreCartId, optionId } = input;
      return await ctx.prisma.productStoreCartToOption.upsert({
        where: {
          productStoreCartId_optionId: {
            productStoreCartId,
            optionId
          }
        },
        create: {
          amount,
          productStoreCart: {
            connect: {
              id: productStoreCartId,
            },
          },
          option: {
            connect: {
              id: optionId,
            }
          }
        },
        update: {
          amount,
          productStoreCart: {
            connect: {
              id: productStoreCartId,
            },
          },
          option: {
            connect: {
              id: optionId,
            }
          }
        }
      });
    }
  })