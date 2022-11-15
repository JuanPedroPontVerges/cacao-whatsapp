import { Product } from "@prisma/client";
import { z } from "zod";
import { createProtectedRouter } from "./context";

export const reportRouter = createProtectedRouter()
  .query("sellsByProduct", {
    input: z.object({ venueId: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      const completeProductStoreCarts = []
      if (input && input.venueId != null) {
        const { venueId } = input;
        const productStoreCarts = await ctx.prisma.productStoreCart.groupBy({
          by: ['productStoreId'],
          _count: {
            productStoreId: true,
          },
          where: {
            productStore: {
              product: {
                category: {
                  menu: {
                    venueId,
                  }
                }
              }
            },
            cart: {
              order: {
                payment: {
                  status: 'APPROVED'
                }
              }
            }
          },
        })
        for (const productStoreCart of productStoreCarts) {
          const newProductStoreCart: { productStoreCart: any; product?: Product | null } = { productStoreCart }
          const product = await ctx.prisma.product.findFirst({
            where: {
              productStore: {
                id: productStoreCart.productStoreId,
              }
            }
          })
          newProductStoreCart.product = product;
          completeProductStoreCarts.push(newProductStoreCart);
        }
        return completeProductStoreCarts;
      }
    },
  })
  .query("customersByVenueId", {
    input: z.object({ venueId: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.venueId != null) {
        const { venueId } = input;
        return await ctx.prisma.customer.findMany({
          where: {
            venueId,
          },
        })
      }
    },
  })