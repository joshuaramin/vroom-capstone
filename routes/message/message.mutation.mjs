import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";
const router = express.Router();

router.post(
   "/",
   tryCatch(async (req, res) => {
      const { senderID, msg } = req.body;

      const administrator = await prisma.user.findMany({
         where: {
            role: "admin",
         },
      });

      const randomAdministraMessage = Math.floor(
         Math.random() * administrator.length
      );
      const message = await prisma.message.create({
         data: {
            message: msg,
            sender: {
               connect: {
                  userID: senderID,
               },
            },
            receiver: {
               connect: {
                  userID: administrator[randomAdministraMessage].userID,
               },
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

router.post(
   "/:id",
   tryCatch(async (res, req) => {
      const { senderID, receiverID, msg } = req.body;
      const originalMessage = await prisma.message.findUnique({
         where: {
            messageID: req.params.id,
         },
         include: {
            User: true,
         },
      });

      if (!originalMessage) throw new "Error Message is not found"();

      const replyMessage = await prisma.message.create({
         data: {
            message: msg,
            sender: {
               connect: {
                  userID: senderID,
               },
            },
            receiver: {
               connect: {
                  userID: receiverID,
               },
            },
         },
      });

      res.json(replyMessage);
   })
);

export default router;
