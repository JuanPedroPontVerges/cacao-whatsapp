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
            productStore: {
              productId: input.id,
            }
          },
          select: {
            productStore: true,
          }
        });
        console.log('productStoreQuery', productStoreQuery);
        const details = await ctx.prisma.productStoreToOptionGroup.findMany({
          where: {  
            productStoreId: productStoreQuery?.productStore?.id,
            enabled: true,
            optionGroup: {
              enabled: true,
            },
            productOptions: {
              some: {
                enabled: true,
              }
            }
          },
          include: {
            productStore: {
              select: {
                product: {
                  select: {
                    name: true,
                    description: true,
                    imageUrl: true,
                  }
                },
              }
            },
            optionGroup: {
              select: {
                id: true,
                name: true,
                options: true
              }
            },
            displayType: true,
          }
        })
        return details;
      }
    },
  })
