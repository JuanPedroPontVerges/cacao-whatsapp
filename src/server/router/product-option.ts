import { z } from "zod";
import { createProtectedRouter } from "./context";

export const productOptionRouter = createProtectedRouter()
  .mutation("create", {
    input: z.object({
      optionId: z.string(),
      productStoreToOptionGroupId: z.string(),
      enabled: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      const {
        optionId,
        productStoreToOptionGroupId,
        enabled
      } = input;
      return await ctx.prisma.productOption.create({
        data: {
          enabled,
          option: {
            connect: {
              id: optionId
            }
          },
          productStoreToOptionGroup: {
            connect: {
              id: productStoreToOptionGroupId
            }
          },
        },
      })
    },
  })
  // .mutation("update", {
  //   input: z.object({
  //     name: z.string().nullish(),
  //     enabled: z.boolean().nullish(),
  //     productOptionId: z.string(),
  //   }),
  //   async resolve({ ctx, input }) {
  //     const { name, enabled, productOptionId } = input;
  //     if (typeof name === 'string') {
  //       return await ctx.prisma.productOption.update({
  //         where: { id: productOptionId },
  //         data: {
  //           name,
  //         },
  //       })
  //     } else if (typeof enabled === 'boolean') {
  //       return await ctx.prisma.productOption.update({
  //         where: { id: productOptionId },
  //         data: {
  //           enabled,
  //         },
  //       })
  //     }

  //   },
  // })
  // .mutation("delete", {
  //   input: z.object({
  //     categoryId: z.string(),
  //   }),
  //   async resolve({ ctx, input }) {
  //     const { categoryId } = input;
  //     return await ctx.prisma.category.delete({
  //       where: { id: categoryId },
  //     })

  //   },
  // })
  .query("findByCategoryId", {
    input: z.object({ id: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.id != null) {
        // return await ctx.prisma.productOption.findMany({
        //   where: {
        //     category: {
        //       id: input.id
        //     }
        //   },
        // });
      }
    },
  })
