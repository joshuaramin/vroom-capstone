import express from "express";
import { prisma } from "../../server.mjs";
import TryCatch from "../../middleware/trycatch.mjs";

const router = express.Router();

router.get(
   "/getAllServices",
   TryCatch(async (req, res) => {
      const services = await prisma.services.findMany();

      return res.json(services);
   })
);

rotuer.get(
   "/getAllServices/:id",
   TryCatch(async (req, res) => {
      const { servicesID } = req.body;
      const services = await prisma.services.findMany({
         where: {
            servicesID,
         },
      });

      return res.json(services);
   })
);

export default router;
