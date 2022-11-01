import { z } from "zod";
import { createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const productStoreCartRouter = createRouter()
  .mutation("create", {
    input: z.object({
      amount: z.number(),
      finalPrice: z.number(),
      productStoreId: z.string(),
      cartId: z.string(),
      additionalInfo: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const { amount, finalPrice, additionalInfo, productStoreId, cartId } = input;
      return await ctx.prisma.productStoreCart.create({
        data: {
          amount,
          finalPrice,
          additionalInfo,
          productStore: {
            connect: {
              id: productStoreId,
            }
          },
          cart: {
            connect: {
              id: cartId,
            }
          }
        },
        select: {
          id: true,
        }
      });
    }
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      amount: z.number(),
      finalPrice: z.number(),
      additionalInfo: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const { amount, finalPrice, additionalInfo, id} = input;
      return await ctx.prisma.productStoreCart.update({
        where: {
          id,
        },
        data: {
          amount,
          finalPrice,
          additionalInfo,
        },
        select: {
          id: true,
        }
      });
    }
  })
  .query("findById", {
    input: z.object({ id: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.id != null) {
        return await ctx.prisma.productStoreCart.findFirst({
          where: {
            id: input.id
          },
          include: {
            productStoreCartToOptions: {
              include: {
                option: {
                  include: {
                    optionGroup: {
                      include: {
                        productStoreToOptionGroups: true,
                      }
                    }
                  }
                }
              }
            },
          }
        });
      }
    },
  })
  .query("getCategoriesByMenuId", {
    input: z.object({ id: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.id != null) {
        return await ctx.prisma.category.findMany({
          where: {
            menuId: input.id
          },
          include: {
            products: true,
          }
        });
      }
    },
  })
  .query("getProductDetails", {
    input: z.object({ id: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.id != null) {
        const productStoreQuery = await ctx.prisma.product.findFirst({
          where: {
            enabled: true,
          },
          select: {
            productStore: true,
          }
        });
        return await ctx.prisma.productStoreToOptionGroup.findMany({
          where: {
            productStoreId: productStoreQuery?.productStore?.id,
            enabled: true,
            optionGroup: {
              enabled: true,
              options: {
                some: {
                  enabled: true
                }
              }
            },
            productOptions: {
              some: {
                enabled: true,
              }
            }
          },
          include: {
            optionGroup: true,
            productOptions: {
              where: {
                enabled: true,
              },
              include: {
                option: true,
              }
            },
            productStore: {
              select: {
                product: {
                  select: {
                    name: true,
                    description: true,
                    imageUrl: true,
                    price: true,
                  }
                },
              }
            },
            displayType: true,
          }
        })
      }
    },
  })
