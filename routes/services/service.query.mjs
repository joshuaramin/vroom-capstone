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

router.get(
   "/getAllServices/:id",
   TryCatch(async (req, res) => {
      const services = await prisma.services.findMany({
         where: {
            servicesID: req.params.id,
         },
      });

      return res.json(services);
   })
);

export default router;
