import { createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const paymentTypeRouter = createRouter()
  .query("findAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.paymentType.findMany()
    }
  })
