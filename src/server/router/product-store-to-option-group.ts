import { z } from "zod";
import { createProtectedRouter } from "./context";

export const productStoreToOptionGroupRouter = createProtectedRouter()
  .mutation("create", {
    input: z.object({
      enabled: z.boolean(),
      amount: z.number().nullish(),
      multipleUnits: z.boolean().nullish(),
      displayTypeId: z.string(),
      optionGroupId: z.string(),
      productStoreId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const {
        enabled,
        amount,
        multipleUnits,
        displayTypeId,
        optionGroupId,
        productStoreId,
      } = input;
      return await ctx.prisma.productStoreToOptionGroup.create({
        data: {
          productStore: {
            connect: {
              id: productStoreId
            }
          },
          displayType: {
            connect: {
              id: displayTypeId
            }
          },
          optionGroup: {
            connect: {
              id: optionGroupId
            }
          },
          enabled,
          amount,
          multipleUnits: multipleUnits || false,
        },
        select: {
          id: true,
        }
      })
    },
  })
  .mutation("update", {
    input: z.object({
      enabled: z.boolean(),
      amount: z.number().nullish(),
      multipleUnits: z.boolean().nullish(),
      optionGroupId: z.string(),
      productStoreId: z.string(),
      displayTypeId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { amount, multipleUnits, enabled, optionGroupId, displayTypeId, productStoreId } = input;
      const productStoreToOptionGroup = await ctx.prisma.productStoreToOptionGroup.findFirst({
        where: {
          productStoreId,
          optionGroupId,
        },
        select: {
          id: true,
        }
      })
      if (productStoreToOptionGroup) {
        await ctx.prisma.productStoreToOptionGroup.updateMany({
          where: {
            productStoreId,
            optionGroupId,
          },
          data: {
            enabled,
            amount,
            multipleUnits: multipleUnits || false,
            displayTypeId
          },
        })
        return { id: productStoreToOptionGroup?.id };
      } else {
        return await ctx.prisma.productStoreToOptionGroup.create({
          data: {
            productStore: {
              connect: {
                id: productStoreId
              }
            },
            displayType: {
              connect: {
                id: displayTypeId
              }
            },
            optionGroup: {
              connect: {
                id: optionGroupId
              }
            },
            enabled,
            amount,
            multipleUnits: multipleUnits || false,
          },
          select: {
            id: true,
          }
        })
      }

    },
  })