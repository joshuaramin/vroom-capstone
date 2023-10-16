import express from "express";

const router = express.Router();
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
   region: process.env.REGION,
   credentials: {
      accessKeyId: process.env.ACCESSKEY,
      secretAccessKey: process.env.SECRETKEY,
   },
});

const uploadImage = multer({
   storage: multerS3({
      s3: client,
      bucket: process.env.BUCKET,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: "public-read",
      key: (req, file, cb) => {
         cb(null, file.originalname);
      },
   }),
});

router.post(
   "/createProduct",
   uploadImage.single("file"),
   tryCatch(async (req, res) => {
      const { name, quantity, price, descriptions, userID } = req.body;

      if (!name || !quantity || !price || !descriptions)
         throw new Error("Fields cannot be empty");

      const products = await prisma.product.create({
         data: {
            image: req.file.location,
            name,
            quantity: parseInt(quantity),
            price: parseInt(price),
            descriptions,
            User: {
               connect: {
                  userID,
               },
            },
         },
      });
      res.json(products);
   })
);

router.delete(
   "/deleteProduct/:id",
   tryCatch(async (req, res) => {
      const prodcuts = await prisma.product.delete({
         where: {
            productID: req.params.id,
         },
      });

      res.json(prodcuts);
   })
);

router.patch(
   "/updateProduct/:id",
   tryCatch(async (req, res) => {
      const { name, descriptions, quantity, price } = req.body;
      const products = await prisma.product.update({
         data: {
            name,
            price,
            descriptions,
            quantity,
         },
         where: {
            productID: req.params.id,
         },
      });

      res.json(products);
   })
);

router.put(
   "/updateProductQuantity/:id",
   tryCatch(async (req, res) => {
      const { quantity } = req.body;
      const products = await prisma.product.update({
         data: {
            quantity,
         },
         where: {
            productID: req.params.id,
         },
      });

      res.json(products);
   })
);

export default router;
