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
  .mutation("update", {
    input: z.object({
      name: z.string().nullish(),
      enabled: z.boolean().nullish(),
      optionGroupId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { name, optionGroupId, enabled } = input;
      if (typeof name === 'string') {
        return await ctx.prisma.optionGroup.update({
          where: { id: optionGroupId },
          data: {
            name,
          },
        })
      } else if (typeof enabled === 'boolean') {
        return await ctx.prisma.optionGroup.update({
          where: { id: optionGroupId },
          data: {
            enabled,
          },
        })
      }

    },
  })
  .mutation("delete", {
    input: z.object({
      optionGroupId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { optionGroupId } = input;
      return await ctx.prisma.optionGroup.delete({
        where: { id: optionGroupId },
      })

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
