import { z } from "zod";
import { createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const storeRouter = createRouter()
  .query("getVenueByUser", {
    input: z.object({ id: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.id != null) {
        return await ctx.prisma.user.findFirst({
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
      }
    },
  })
  .query("getCategoriesByMenuId", {
    input: z.object({ id: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.id != null) {
        return await ctx.prisma.category.findMany({
          where: {
            menuId: input.id,
            enabled: true,
            AND: {
              products: {
                some: {
                  enabled: true,
                }
              }
            }
          },
          include: {
            products: true,
            menu: {
              select: {
                venue: {
                  select: {
                    name: true
                  }
                },
              }
            }
          }
        });
      }
    },
  })
  .query("getProductDetailsByProductId", {
    input: z.object({ id: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.id != null) {
        const productQuery = await ctx.prisma.product.findFirst({
          where: {
            id: input.id,
            enabled: true,
          },
          select: {
            productStore: true,
            name: true,
            description: true,
            imageUrl: true,
            price: true,
          }
        });
        return await ctx.prisma.productStoreToOptionGroup.findMany({
          where: {
            productStoreId: productQuery?.productStore?.id,
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
