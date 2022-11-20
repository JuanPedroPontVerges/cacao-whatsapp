import { z } from "zod";
import { createProtectedRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const scheduleRouter = createProtectedRouter()
  .mutation("create", {
    input: z.object({
      menuSettingId: z.string(),
      day: z.string(),
      monday: z.object({
        fromMinute: z.string().nullish().nullish(),
        fromHour: z.string().nullish(),
        toMinute: z.string().nullish(),
        toHour: z.string().nullish(),
      })
        .nullish(),
      tuesday: z.object({
        fromMinute: z.string().nullish().nullish(),
        fromHour: z.string().nullish(),
        toMinute: z.string().nullish(),
        toHour: z.string().nullish(),
      })
        .nullish(),
      wendsday: z.object({
        fromMinute: z.string().nullish().nullish(),
        fromHour: z.string().nullish(),
        toMinute: z.string().nullish(),
        toHour: z.string().nullish(),
      })
        .nullish(),
      thursday: z.object({
        fromMinute: z.string().nullish().nullish(),
        fromHour: z.string().nullish(),
        toMinute: z.string().nullish(),
        toHour: z.string().nullish(),
      })
        .nullish(),
      friday: z.object({
        fromMinute: z.string().nullish().nullish(),
        fromHour: z.string().nullish(),
        toMinute: z.string().nullish(),
        toHour: z.string().nullish(),
      })
        .nullish(),
      saturday: z.object({
        fromMinute: z.string().nullish().nullish(),
        fromHour: z.string().nullish(),
        toMinute: z.string().nullish(),
        toHour: z.string().nullish(),
      })
        .nullish(),
      sunday: z.object({
        fromMinute: z.string().nullish().nullish(),
        fromHour: z.string().nullish(),
        toMinute: z.string().nullish(),
        toHour: z.string().nullish(),
      })
        .nullish(),
    }),
    async resolve({ ctx, input }) {
      const { menuSettingId, day, monday, tuesday, wendsday, thursday, friday, saturday, sunday } = input;
      const currentDay = day === 'monday' ? monday : day === 'tuesday' ? tuesday : day === 'wendsday' ? wendsday : day === 'thursday' ? thursday : day === 'friday' ? friday : day === 'saturday' ? saturday : sunday
      const foundSchedule = await ctx.prisma.schedule.findFirst({
        where: {
          day,
          menuSettingId,
        }
      })
      if (foundSchedule) {
        await ctx.prisma.schedule.update({
          where: {
            id: foundSchedule.id,
          },
          data: {
            fromHour: currentDay?.fromHour,
            fromMinute: currentDay?.fromMinute,
            toHour: currentDay?.toHour,
            toMinute: currentDay?.toMinute,
          }
        })
      } else {
        await ctx.prisma.schedule.create({
          data: {
            fromHour: currentDay?.fromHour,
            fromMinute: currentDay?.fromMinute,
            toHour: currentDay?.toHour,
            toMinute: currentDay?.toMinute,
            day,
            menuSetting: {
              connect: {
                id: menuSettingId,
              }
            }
          },
        })
      }
    },
  });
