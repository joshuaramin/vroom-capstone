import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";
const router = express.Router();

router.get(
   "/",
   tryCatch(async (req, res) => {
      const logs = await prisma.logs.findMany();

      res.json(logs);
   })
);

export default router;
