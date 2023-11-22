import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";

const router = express();

router.post(
   "/createArchive",
   tryCatch(async (req, res) => {
      const { userID, startDate, endDate } = req.body;
      const archive = await prisma.archive.create({
         data: {
            startDate,
            endDate,
         },
      });

      res.json(archive);
   })
);
export default router;
