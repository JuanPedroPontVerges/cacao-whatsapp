import { z } from "zod";
import { createProtectedRouter } from "./context";

export const productRouter = createProtectedRouter()
  .mutation("create", {
    input: z.object({
      name: z.string(),
      description: z.string(),
      imageUrl: z.string().nullish(),
      price: z.number().nullish(),
      index: z.number(),
      categoryId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const {
        name,
        description,
        imageUrl,
        index,
        categoryId,
        price,
      } = input;
      return await ctx.prisma.product.create({
        data: {
          name,
          description,
          imageUrl,
          index,
          price,
          productStore: {
            create: {}
          },
          category: {
            connect: {
              id: categoryId,
            }
          }
        },
        select: {
          productStore: true,
        }
      })
    },
  })
  .mutation("indexes", {
    input: z.array(z.string()), /* array of products id's */
    async resolve({ ctx, input }) {
      for (let index = 0; index < input.length; index++) {
        await ctx.prisma.product.update({ where: { id: input[index] }, data: { index } })
      }
    },
  })
  .mutation("update", {
    input: z.object({
      name: z.string().nullish(),
      description: z.string().nullish(),
      price: z.number().nullish(),
      enabled: z.boolean().nullish(),
      imageUrl: z.string().nullish(),
      productId: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const { name, productId, enabled, description, price, imageUrl } = input;
      if (typeof name === 'string') {
        if (input && input.productId != null) {
          return await ctx.prisma.product.update({
            where: { id: productId as string },
            data: {
              imageUrl,
              name,
              description,
              price,
            },
            select: {
              productStore: true,
            }
          })
        }
      } else if (typeof enabled === 'boolean') {
        return await ctx.prisma.product.update({
          where: { id: productId as string },
          data: {
            enabled,
          },
          select: {
            productStore: true,
          }
        })
      }

    },
  })
  .mutation("delete", {
    input: z.object({
      productId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { productId } = input;
      return await ctx.prisma.product.delete({
        where: { id: productId },
      })

    },
  })
  .query("findByCategoryId", {
    input: z.object({ id: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.id != null) {
        return await ctx.prisma.product.findMany({
          where: {
            category: {
              id: input.id
            }
          },
          include: {
            productStore: {
              select: {
                productStoreToOptionGroups: {
                  include: {
                    optionGroup: true,
                    productOptions: true
                  }
                }
              }
            }
          }
        });
      }
    },
  })
