import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";

const router = express.Router();

router.get(
   "/getmyorders",
   tryCatch(async (req, res) => {
      const { userID } = req.body;
      const orders = await prisma.orders.findMany({
         where: {
            User: {
               some: {
                  userID,
               },
            },
         },
      });

      res.json(orders);
   })
);

router.get(
   "/",
   tryCatch(async (req, res) => {
      const orders = await prisma.orders.findMany({
         include: {
            User: true,
         },
      });
      res.json(orders);
   })
);

router.get(
   "/getmyorders/:id",
   tryCatch(async (req, res) => {
      const order = await prisma.orders.findMany({
         where: {
            orderID: req.params.id,
         },
      });

      res.json(order);
   })
);
export default router;
