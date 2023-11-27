import express from "express";
import { prisma } from "../../server.mjs";
import TryCatch from "../../middleware/trycatch.mjs";
import { uploadImage } from "../../helpers/aws.mjs";

const router = express.Router();

router.post(
   "/createServices",
   uploadImage.single("file"),
   TryCatch(async (req, res) => {
      const { services, description, userID, price } = req.body;

      if (!service || !description || !price || file)
         throw new Error("Fields are required");
      const service = await prisma.services.create({
         data: {
            image: req.file.location,
            services,
            description,
            price: parseInt(price),
            User: {
               connect: {
                  userID,
               },
            },
         },
      });

      await prisma.logs.create({
         data: {
            title: "Added New Services",
            User: {
               connect: {
                  userID,
               },
            },
         },
      });

      res.json(service);
   })
);

router.patch(
   "/updateService/:id",
   TryCatch(async (req, res) => {
      const { description, services, userID } = req.body;
      if (!description || !services) throw new Error("Fields are required");

      const service = await prisma.services.update({
         data: {
            image,
            description,
            services,
         },
         where: {
            servicesID: req.params.id,
         },
      });

      await prisma.logs.create({
         data: {
            title: "Edited Service Details",
            User: {
               connect: {
                  userID,
               },
            },
         },
      });

      res.json(service);
   })
);

router.post(
   "/deleteService/:id",
   TryCatch(async (req, res) => {
      const { userID } = req.body;
      const service = await prisma.services.delete({
         where: {
            servicesID: req.params.id,
         },
      });

      await prisma.logs.create({
         data: {
            title: "Deleted Service",
            User: {
               connect: {
                  userID,
               },
            },
         },
      });

      res.json(service);
   })
);

export default router;
