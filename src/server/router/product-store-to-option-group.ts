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
      /**
       * TODO 
       * [] - Add enabled column productStoreToOptionGroupEntity
       */
      // return await ctx.prisma.productStoreToOptionGroup.create({
      //   data: {
      //     name,
      //     description,
      //     imageUrl,
      //     index,
      //     price,
      //   },
      // })
    },
  })
  // .mutation("update", {
  //   input: z.object({
  //     name: z.string().nullish(),
  //     enabled: z.boolean().nullish(),
  //     productStoreToOptionGroupId: z.string(),
  //   }),
  //   async resolve({ ctx, input }) {
  //     const { name, enabled, productStoreToOptionGroupId } = input;
  //     if (typeof name === 'string') {
  //       return await ctx.prisma.productStoreToOptionGroup.update({
  //         where: { id: productStoreToOptionGroupId },
  //         data: {
  //           name,
  //         },
  //       })
  //     } else if (typeof enabled === 'boolean') {
  //       return await ctx.prisma.productStoreToOptionGroup.update({
  //         where: { id: productStoreToOptionGroupId },
  //         data: {
  //           enabled,
  //         },
  //       })
  //     }

  //   },
  // })
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
      console.log('input', input);
      if (input && input.id != null) {
        // return await ctx.prisma.productStoreToOptionGroup.findMany({
        //   where: {
        //     category: {
        //       id: input.id
        //     }
        //   },
        // });
      }
    },
  })
