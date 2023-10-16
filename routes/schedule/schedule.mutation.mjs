import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import googleCalendar from "../../helpers/calendar.mjs";
import { prisma } from "../../server.mjs";
import { SENDMAIL } from "../../helpers/sengrid.mjs";

const router = express.Router();

router.post(
   "/createSchedule",
   tryCatch(async (req, res) => {
      const { date, time, userID, service } = req.body;

      const dateVerified = await prisma.schedule.findMany({
         where: {
            date,
         },
      });

      if (dateVerified.length >= 2)
         throw new Error("The 2 maximum exceed to schedule this day");

      const schedule = await prisma.schedule.create({
         data: {
            date,
            service,
            status: "pending",
            time,
            User: {
               connect: {
                  userID,
               },
            },
         },
      });

      res.json(schedule);
   })
);

router.put(
   "/updateSchedule/:id",
   tryCatch(async (req, res) => {
      const { status } = req.body;
      const schedule = await prisma.schedule.update({
         where: {
            scheduleID: req.params.id,
         },
         data: {
            status,
         },
         include: {
            User: true,
         },
      });

      if (schedule.status === "accepted") {
         switch (schedule.time) {
            case "9:00 AM":
               googleCalendar(
                  schedule.date,
                  "01:00",
                  "02:00",
                  schedule.User[0].email
               );
               SENDMAIL(schedule.User[0].email, "", "");
               break;
            case "10:00 AM":
               googleCalendar(
                  schedule.date,
                  "02:00",
                  "03:00",
                  schedule.User[0].email
               );
               SENDMAIL(schedule.User[0].email, "", "");
               break;
            case "11:00 AM":
               googleCalendar(
                  schedule.date,
                  "03:00",
                  "04:00",
                  schedule.User[0].email
               );
               SENDMAIL(schedule.User[0].email, "", "");
               break;
            case "1:00 PM":
               googleCalendar(
                  schedule.date,
                  "05:00",
                  "06:00",
                  schedule.User[0].email
               );
               SENDMAIL(schedule.User[0].email, "", "");
               break;
            case "2:00 PM":
               googleCalendar(
                  schedule.date,
                  "06:00",
                  "07:00",
                  schedule.User[0].email
               );
               SENDMAIL(schedule.User[0].email, "", "");
               break;
            case "3:00 PM":
               googleCalendar(
                  schedule.date,
                  "07:00",
                  "08:00",
                  schedule.User[0].email
               );
               SENDMAIL(schedule.User[0].email, "", "");
               break;

            case "4:00 PM":
               googleCalendar(
                  schedule.date,
                  "08:00",
                  "09:00",
                  schedule.User[0].email
               );
               SENDMAIL(schedule.User[0].email, "", "");
               break;
         }
      }

      res.json(schedule);
   })
);

export default router;
