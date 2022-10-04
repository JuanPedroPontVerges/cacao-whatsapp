import { z } from "zod";
import { createProtectedRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const categoryRouter = createProtectedRouter()
  .mutation("create", {
    input: z.object({
      name: z.string(),
      menuId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { name, menuId } = input;
      const category = await ctx.prisma.category.create({
        data: {
          name,
          menuId
        },
      })
      return category
    },
  })
  .query("findCategoriesByMenuId", {
    input: z.object({ id: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.id != null) {
        return await ctx.prisma.category.findMany({
          where: {
            menuId: input.id
          },
        });
      }
    },
  })
