import { z } from "zod";
import { createProtectedRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const optionRouter = createProtectedRouter()
  .mutation("create", {
    input: z.object({
      name: z.string(),
      description: z.string().nullish(),
      price: z.number().nullish(),
      maxAmount: z.number().nullish(),
      optionGroupId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const category = await ctx.prisma.option.create({
        data: {
          ...input
        },
      })
      return category
    },
  })
  .mutation("update", {
    input: z.object({
      name: z.string().nullish(),
      enabled: z.boolean().nullish(),
      optionId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { name, optionId, enabled } = input;
      if (typeof name === 'string') {
        return await ctx.prisma.option.update({
          where: { id: optionId },
          data: {
            name,
          },
        })
      } else if (typeof enabled === 'boolean') {
        return await ctx.prisma.option.update({
          where: { id: optionId },
          data: {
            enabled,
          },
        })
      }

    },
  })
  .mutation("indexes", {
    input: z.array(z.string()), /* array of options id's */
    async resolve({ ctx, input }) {
      for (let index = 0; index < input.length; index++) {
        await ctx.prisma.option.update({ where: { id: input[index] }, data: { index } })
      }
    },
  })
  .mutation("delete", {
    input: z.object({
      optionId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { optionId } = input;
      return await ctx.prisma.option.delete({
        where: { id: optionId },
      })

    },
  })
  .query("findOptionsByOptionGroupId", {
    input: z.object({ id: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.id != null) {
        const response = await ctx.prisma.option.findMany({
          where: {
            optionGroupId: input.id
          },
          orderBy: {
            index: 'asc'
          }
        });
        return response;
      }
    },
  })
