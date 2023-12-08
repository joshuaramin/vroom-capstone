import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";

const router = express();

router.get(
   "/getAllArchive",
   tryCatch(async (req, res) => {
      const archvive = await prisma.archive.findMany({
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

      res.json(archvive);
   })
);

router.get(
   "/getAllArchive/:id",
   tryCatch(async (req, res) => {
      const archive = await prisma.archive.findMany({
         where: {
            archieveID: req.params.id,
         },
      });
      res.json(archive);
   })
);

export default router;
