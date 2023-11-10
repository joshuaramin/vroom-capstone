import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";

const router = express();

router.post(
   "/createArchive",
   tryCatch(async (req, res) => {
      const { userID, orderID } = req.body;
      const archive = await prisma.archive.create({
         data: {
            Orders: {
               connect: {
                  orderID,
               },
            },
            User: {
               connect: {
                  userID,
               },
            },
         },
      });

      res.json(archive);
   })
);
export default router;
