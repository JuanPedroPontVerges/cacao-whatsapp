import { z } from "zod";
import { createProtectedRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const userRouter = createProtectedRouter()
  .query("getVenues", {
    input: z.object({ id: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.id != null) {
        const user = await ctx.prisma.user.findFirst({
          where: {
            id: input.id
          },
          select: {
            venueId: true,
            venue: {
              include: {
                menus: {
                  include: {
                    setting: {
                      include: {
                        schedules: true,
                      }
                    }
                  }
                }
              }
            },
          }
        });
        return user;
      }
    },
  })
  .query("getSecretMessage", {
    resolve({ ctx }) {
      return "He who asks a question is a fool for five minutes; he who does not ask a question remains a fool forever.";
    },
  });
