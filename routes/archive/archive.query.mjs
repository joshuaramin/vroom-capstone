import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";

const router = express();

router.get(
   "/getAllArchive",
   tryCatch(async (req, res) => {
      const archvive = await prisma.archive.findMany();

      res.json(archive);
   })
);

router.get(
   "/getAllMyArchive",
   tryCatch(async (req, res) => {
      const { userID } = req.body;
      const archive = await prisma.archive.findMany({
         where: {
            userID,
         },
      });

      res.json(archive);
   })
);

router.get(
   "/getAllMyArchive/:id",
   tryCatch(async (req, res) => {
      const archive = await prisma.archive.findMany({
         where: {
            archieveID: req.params.id,
         },
      });
      res.json(archive);
   })
);

export default express;
