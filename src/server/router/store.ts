import { z } from "zod";
import { createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const storeRouter = createRouter()
  .query("getVenueByUser", {
    input: z.object({ id: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.id != null) {
        const store = await ctx.prisma.user.findFirst({
          where: {
            id: input.id
          },
          select: {
            venueId: true,
            venue: {
              select: {
                menus: true
              }
            }
          }
        });
        return store;
      }
    },
  })
  .query("getCategoriesByMenuId", {
    input: z.object({ id: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      console.log('input', input);
      if (input && input.id != null) {
        const categories = await ctx.prisma.category.findMany({
          where: {
            menuId: input.id
          },
          include: {
            products: true,
          }
        });
        return categories;
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
        const details = await ctx.prisma.productStoreToOptionGroup.findMany({
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
            // optionGroup: {
            //   include: {
            //     options: {
            //       where: {
            //         enabled: true
            //       }
            //     }
            //   }
            // },
            displayType: true,
          }
        })
        return details;
      }
    },
  })
