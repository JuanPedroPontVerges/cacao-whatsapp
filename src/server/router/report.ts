import { Product, ProductStoreCart } from "@prisma/client";
import dayjs from "dayjs";
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
  .query("moneyPerDay", {
    input: z.object({ venueId: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      /** TODO
       * [] Terminar linea de grafico para saber money x day
       */
      if (input && input.venueId != null) {
        const { venueId } = input;
        const productStoreCarts = await ctx.prisma.productStoreCart.findMany({
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
            createdAt: {
              lt: dayjs().endOf('month').toDate(),
              gt: dayjs().startOf('month').toDate()
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
        const newProductStoreCarts = [];
        for (const productStoreCart of productStoreCarts) {
          newProductStoreCarts.push({ ...productStoreCart, dayOfTheMonth: dayjs(productStoreCart.createdAt).format('D') })
        }
        return groupBy(newProductStoreCarts, 'dayOfTheMonth')
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
  .query("weeklyFinishedOrders", {
    input: z.object({ venueId: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.venueId != null) {
        return await prisma?.order.findMany({
          where: {
            State: {
              name: 'Despachado'
            },
            payment: {
              status: 'APPROVED'
            },
            customer: {
              venueId: input.venueId
            }
          },
          include: {
            payment: true,
            customer: true,
            Cart: {
              select: {
                productStoreCarts: true,
              }
            }
          }
        })
      }
    },
  })

function groupBy(xs: any[], key: string) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}