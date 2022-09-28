import { createRouter } from "./context";
import { z } from "zod";

export const registerRouter = createRouter()
  .mutation("execute", {
    input: z
      .object({
        name: z.string().nullish(),
        email: z.string().nullish(),
      })
      .nullish(),
    async resolve({ input, ctx }) {
      const user = await ctx.prisma.user.create({ data: { ...input } })
      console.log('user', user);
    },
  });