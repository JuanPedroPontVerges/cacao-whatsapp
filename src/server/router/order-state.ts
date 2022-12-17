import { z } from "zod";
import { createRouter } from "./context";

export const orderStateRouter = createRouter()
  .query("findAll", {
    input: z.object({
      isReport: z.boolean(),
    }).nullish(),
    async resolve({ ctx, input }) {
      if (input?.isReport) {
        const orderStates = await ctx.prisma.orderState.findMany();
        orderStates.unshift({ id: 'all', name: 'Todos' })
        return orderStates;
      } else {
        return await ctx.prisma.orderState.findMany();
      }
    }
  })
