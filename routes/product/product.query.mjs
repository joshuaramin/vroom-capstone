import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";
const router = express.Router();

router.get(
   "/getAllProduct",
   tryCatch(async (req, res) => {
      const products = await prisma.product.findMany();

      res.json(products);
   })
);

router.get(
   "/getProductById/:id",
   tryCatch(async (req, res) => {
      const product = await prisma.product.findMany({
         where: {
            productID: req.params.id,
         },
      });

      res.json(product);
   })
);

router.get(
   "/getSearchProduct",
   tryCatch(async (req, res) => {
      const { search } = req.body;
      const products = await prisma.product.findMany({
         where: {
            name: {
               contains: search,
            },
         },
      });

      res.json(products);
   })
);
export default router;
