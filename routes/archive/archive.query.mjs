import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";
import { subWeeks, subMonths, subDays } from "date-fns";
const router = express();

const currentDateToday = new Date();

router.get(
   "/getAllArchive",
   tryCatch(async (req, res) => {
      const { filter, skip } = req.query;
      switch (filter) {
         case "Daily":
            const previousDay = subDays(currentDateToday, 0);
            const Dailyarchvive = await prisma.archive.findMany({
               take: 6,
               skip: skip * 6,
               include: {
                  User: {
                     include: {
                        profile: true,
                     },
                  },
               },
            });

            return res.json(Dailyarchvive);
            break;
         case "Weekly":
            const WeeklyArchvive = await prisma.$queryRawUnsafe(`
            SELECT "Archive".*, "User".*,"Profile".*
            FROM "Archive"
            JOIN "User" ON "Archive"."userID" = "User"."userID"
            JOIN "Profile" ON "Profile"."userID" = "User"."userID"
            WHERE EXTRACT(WEEK FROM "Archive"."createdAt") = EXTRACT(WEEK FROM NOW());`);

            return res.json(WeeklyArchvive);
            break;
         case "Monthly":
            const MonthlyArchvive = await prisma.$queryRawUnsafe(`
            SELECT "Archive".*, "User".*,"Profile".*
            FROM "Archive"
            JOIN "User" ON "Archive"."userID" = "User"."userID"
            JOIN "Profile" ON "Profile"."userID" = "User"."userID"
            WHERE EXTRACT(MONTH FROM "Archive"."createdAt") = EXTRACT(MONTH FROM NOW());`);

            return res.json(MonthlyArchvive);
            break;
      }
   })
);

router.get(
   "/getAllArchive/:id",
   tryCatch(async (req, res) => {
      const archives = await prisma.archive.findUnique({
         where: {
            archieveID: req.params.id,
         },
      });
      const archive = await prisma.archive.findFirst({
         where: {
            archieveID: req.params.id,
         },
         include: {
            Orders: {
               where: {
                  createdAt: {
                     gte: archives.startDate,
                     lte: archives.endDate,
                  },
               },
               include: {
                  User: {
                     include: {
                        profile: true,
                     },
                  },
                  Product: {
                     include: true,
                  },
               },
            },
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
