import { createProtectedRouter } from "./context";

export const displayTypeRouter = createProtectedRouter()
  .query("get", {
    async resolve({ ctx }) {
      return await ctx.prisma.displayType.findMany()
    },
  });
