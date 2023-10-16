import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";
const router = express.Router();

router.get(
   "/:id",
   tryCatch(async (req, res) => {
      const message = await prisma.message.findMany({
         where: {
            sender: {
               userID: req.params.id,
            },
         },
         include: {
            sender: { include: { profile: true } },
            receiver: { include: { profile: true } },
         },
      });

      res.json(message);
   })
);

export default router;
