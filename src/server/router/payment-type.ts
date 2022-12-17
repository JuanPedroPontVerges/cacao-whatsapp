import { z } from "zod";
import { createRouter } from "./context";

export const paymentTypeRouter = createRouter()
  .query("findAll", {
    input: z.object({
      isReport: z.boolean(),
    }).nullish(),
    async resolve({ ctx, input }) {
      if (input?.isReport) {
        const paymentTypes = await ctx.prisma.paymentType.findMany()
        paymentTypes.unshift({ id: 'all', name: 'Todos' })
        return paymentTypes;
      } else {
        return await ctx.prisma.paymentType.findMany()
      }
    }
  })
