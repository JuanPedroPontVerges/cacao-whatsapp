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
            },
          },
        },
      })
    },
  })
  .mutation("update", {
    input: z.object({
      optionId: z.string(),
      productStoreToOptionGroupId: z.string(),
      enabled: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      const { productStoreToOptionGroupId, enabled, optionId } = input;
      const productOption = await ctx.prisma.productOption.findFirst({
        where: {
          productStoreToOptionGroupId,
          optionId,
        },
      })
      if (productOption) {
        await ctx.prisma.productOption.update({
          where: {
            id: productOption.id
          },
          data: {
            enabled
          }
        })
      } else {
        await ctx.prisma.productOption.create({
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
              },
            },
          },
        })
      }
    },
  })
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
