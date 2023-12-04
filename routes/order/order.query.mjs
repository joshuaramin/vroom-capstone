import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";

const router = express.Router();

router.get(
   "/getAllMyOrders/:id",
   tryCatch(async (req, res) => {
      const orders = await prisma.orders.findMany({
         where: {
            User: {
               some: {
                  userID: req.params.id,
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
         take: 6,
         skip: req.query.skip * 6,
         include: {
            User: {
               include: {
                  profile: true,
               },
            },
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
