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
      return await ctx.prisma.category.create({
        data: {
          name,
          menuId
        },
      })
    },
  })
  .mutation("update", {
    input: z.object({
      name: z.string().nullish(),
      enabled: z.boolean().nullish(),
      categoryId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { name, enabled, categoryId } = input;
      if (typeof name === 'string') {
        return await ctx.prisma.category.update({
          where: { id: categoryId },
          data: {
            name,
          },
        })
      } else if (typeof enabled === 'boolean') {
        return await ctx.prisma.category.update({
          where: { id: categoryId },
          data: {
            enabled,
          },
        })
      }

    },
  })
  .mutation("delete", {
    input: z.object({
      categoryId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { categoryId } = input;
      return await ctx.prisma.category.delete({
        where: { id: categoryId },
      })

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
