import { z } from "zod";
import { createProtectedRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const optionGroupRouter = createProtectedRouter()
  .mutation("create", {
    input: z.object({
      name: z.string(),
      menuId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { name, menuId } = input;
      const category = await ctx.prisma.optionGroup.create({
        data: {
          name,
          menuId
        },
      })
      return category
    },
  })
  .query("findOptionGroupsByMenuId", {
    input: z.object({ id: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.id != null) {
        return await ctx.prisma.optionGroup.findMany({
          where: {
            menuId: input.id
          },
        });
      }
    },
  })
