import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";

const router = express.Router();

router.get(
   "/",
   tryCatch(async (req, res) => {
      const schedule = await prisma.schedule.findMany();

      res.json(schedule);
   })
);

router.get(
   "/getAllMyAppointments/:id",
   tryCatch(async (req, res) => {
      const schedule = await prisma.schedule.findMany({
         where: {
            User: {
               some: {
                  userID: req.params.id,
               },
            },
         },
      });

      res.json(schedule);
   })
);
router.get(
   "/:id",
   tryCatch(async (req, res) => {
      const schedule = await prisma.schedule.findMany({
         where: {
            scheduleID: req.params.id,
         },
      });

      res.json(schedule);
   })
);

export default router;
