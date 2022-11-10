import { z } from "zod";
import { createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const customerRouter = createRouter()
  .query("findByPhoneNumber", {
    input: z.object({
      phoneNumber: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { phoneNumber } = input;
      return await ctx.prisma.customer.findFirst({
        where: {
          phoneNumber,
        },
      })
    }
  })