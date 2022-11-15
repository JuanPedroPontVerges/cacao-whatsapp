import { CartState } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const paymentRouter = createRouter()
  .mutation("create", {
    input: z.object({
      orderId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { orderId } = input;
      return await ctx.prisma.payment.create({
        data: {
          order: {
            connect: {
              id: orderId,
            },
          },
        },
        select: {
          id: true,
        }
      })
    },
  })