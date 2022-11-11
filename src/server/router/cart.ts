import { CartState } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const cartRouter = createRouter()
  .mutation("create", {
    input: z.object({
      finalPrice: z.number(),
    }),
    async resolve({ ctx, input }) {
      const { finalPrice } = input;
      return await ctx.prisma.cart.create({
        data: {
          finalPrice,
        },
        select: {
          id: true,
        }
      })
    },
  })
  .mutation("deleteProductStoreCart", {
    input: z.object({
      productStoreCartId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { productStoreCartId: id } = input;
      return await ctx.prisma.productStoreCart.delete({
        where: {
          id,
        }
      })
    },
  })
  .mutation("updateState", {
    input: z.object({
      cartId: z.string().nullish(),
      state: z.enum(['FINISHED', 'PENDING']),
    }),
    async resolve({ ctx, input }) {
      const { cartId, state } = input;
      if (cartId && cartId != null) {
        return await ctx.prisma.cart.update({
          where: {
            id: cartId,
          },
          data: {
            state,
          }
        })
      }
    },
  })
  .query("findById", {
    input: z.object({
      id: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      if (id && id != null) {
        return await ctx.prisma.cart.findFirst({
          where: {
            id,
          },
          include: {
            productStoreCarts: {
              include: {
                productStoreCartToOptions: {
                  include: {
                    option: {
                      include: {
                        optionGroup: true
                      }
                    }
                  }
                },
                productStore: {
                  select: {
                    id: true,
                    product: {
                      select: {
                        id: true,
                        imageUrl: true,
                        price: true,
                        name: true,
                      }
                    }
                  }
                }
              }
            }
          }
        })
      }
    }
  })
  .query("findProductStoreCartQuantity", {
    input: z.object({
      cartId: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const { cartId } = input;
      if (cartId && cartId != null) {
        return await ctx.prisma.productStoreCart.findMany({
          where: {
            cartId,
          },
          select: {
            _count: true
          }
        })
      }
    }
  })