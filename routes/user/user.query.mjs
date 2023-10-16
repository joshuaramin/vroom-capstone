import express from "express";
import { prisma } from "../../server.mjs";

const router = express.Router();

router.get("/getUsers", async (req, res) => {
   const users = await prisma.user.findMany({
      include: {
         profile: true,
      },
   });
   res.json(users);
});

router.get("/getUsersId/:id", async (req, res) => {
   const users = await prisma.user.findMany({
      where: { userID: req.params.id },
   });
   res.json(users);
});

export default router;
