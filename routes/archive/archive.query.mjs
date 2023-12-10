import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";
import { subWeeks, subMonths, subDays } from "date-fns";
const router = express();

const currentDateToday = new Date();

router.get(
   "/getAllArchive",
   tryCatch(async (req, res) => {
      const { filter } = req.query;
      switch (filter) {
         case "Daily":
            const previousDay = subDays(currentDateToday, 0);
            const Dailyarchvive = await prisma.archive.findMany({
               take: 6,
               skip: req.query.skip * 6,
               where: {
                  createdAt: previousDay,
               },
               include: {
                  User: {
                     include: {
                        profile: true,
                     },
                  },
               },
            });

            res.json(Dailyarchvive);
            break;
         case "Weekly":
            const previousWeekStart = subWeeks(currentDateToday, 0);
            const previousWeekEnd = subWeeks(
               currentDateToday,
               currentDateToday.getDay()
            );
            const WeeklyArchvive = await prisma.archive.findMany({
               take: 6,
               skip: req.query.skip * 6,
               where: {
                  createdAt: {
                     gte: previousWeekStart.toISOString(),
                     lte: previousWeekEnd.toISOString(),
                  },
               },
               include: {
                  User: {
                     include: {
                        profile: true,
                     },
                  },
               },
            });

            res.json(WeeklyArchvive);
            break;
         case "Mothly":
            const previousMonthStart = subMonths(currentDate, 1);
            const previousMonthEnd = subDays(
               currentDate,
               currentDate.getDate()
            );
            const MonthlyArchvive = await prisma.archive.findMany({
               take: 6,
               skip: req.query.skip * 6,
               where: {
                  createdAt: {
                     gte: previousMonthStart.toISOString(),
                     lte: previousMonthEnd.toISOString(),
                  },
               },
               include: {
                  User: {
                     include: {
                        profile: true,
                     },
                  },
               },
            });

            res.json(MonthlyArchvive);
            break;
      }
   })
);

router.get(
   "/getAllArchive/:id",
   tryCatch(async (req, res) => {
      const archive = await prisma.archive.findFirst({
         where: {
            archieveID: req.params.id,
         },
         include: {
            Orders: true,
            User: {
               include: {
                  profile: true,
               },
            },
         },
      });
      res.json(archive);
   })
);

export default router;
