import { z } from "zod";
import { createProtectedRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const menuSettingRouter = createProtectedRouter()
  .mutation("create", {
    input: z.object({
      id: z.string().nullish(),
      minPurchaseAmount: z.number().nullish()
    }),
    async resolve({ ctx, input }) {
      const { id, minPurchaseAmount } = input;
      const parsedId = id as string | undefined;
      return await ctx.prisma.menuSetting.upsert({
        where: {
          id: parsedId || 'nevergonnafindit',
        },
        create: {
          minPurchaseAmount,
        },
        update: {
          minPurchaseAmount,
        },
      })
    },
  });
