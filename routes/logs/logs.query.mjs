import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";
const router = express.Router();

router.get(
   "/getMyLogs",
   tryCatch(async (req, res) => {
      const { userID } = req.body;

      const logs = await prisma.logs.findMany({
         where: {
            User: {
               userID,
            },
         },
      });

      res.json(logs);
   })
);

export default router;
