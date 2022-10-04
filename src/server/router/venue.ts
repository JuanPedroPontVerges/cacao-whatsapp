import { z } from "zod";
import { createProtectedRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const venueRouter = createProtectedRouter()
  .mutation("create", {
    input: z.object({
      name: z.string(),
      address: z.string(),
      userId: z.string(),
      googlePlaceId: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const { name, address, googlePlaceId, userId } = input;
      await ctx.prisma.venue.create({
        data: {
          name,
          address,
          googlePlaceId,
          users: {
            connect: {
              id: userId,
            }
          },
          menus: {
            create: {}
          }
        },
      })
    },
  });
