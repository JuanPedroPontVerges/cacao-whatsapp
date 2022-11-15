import { createRouter } from "./context";

export const orderStateRouter = createRouter()
  .query("findAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.orderState.findMany()
    }
  })
