import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";
import TryCatch from "../../middleware/trycatch.mjs";
const router = express.Router();

router.get(
   "/getAllProduct",
   tryCatch(async (req, res) => {
      const { take, offset, orders } = req.body;

      const products = await prisma.product.findMany({
         take,
         skip: offset,
         orderBy: {
            createdAt: orders,
         },
      });

      return res.json(products);
   })
);

router.get(
   "/getProductsByCategory/Tires",
   TryCatch(async (req, res) => {
      const { take, offset, orders } = req.body;

      const products = await prisma.product.findMany({
         where: {
            category: req.params.category,
         },
         take,
         skip: offset,
         orderBy: {
            createdAt: orders,
         },
      });

      return res.json(products);
   })
);

router.get(
   "/getProductsByCategory/Cars Battery",
   TryCatch(async () => {
      const { take, offset, orders } = req.body;

      const products = await prisma.product.findMany({
         where: {
            category: "Cars Battery",
         },
         take,
         skip: offset,
         orderBy: {
            createdAt: orders,
         },
      });

      return res.json(products);
   })
);

router.get(
   "/getProductsByCategory/Tire Mags",
   TryCatch(async () => {
      const { take, offset, orders } = req.body;

      const products = await prisma.product.findMany({
         where: {
            category: "Tire Mags",
         },
         take,
         skip: offset,
         orderBy: {
            createdAt: orders,
         },
      });

      return res.json(products);
   })
);

router.get(
   "/getProductsByCategory/Oils",
   TryCatch(async () => {
      const { take, offset, orders } = req.body;

      const products = await prisma.product.findMany({
         where: {
            category: "Oils",
         },
         take,
         skip: offset,
         orderBy: {
            createdAt: orders,
         },
      });

      return res.json(products);
   })
);

router.get(
   "/getProductsByCategory/Filters",
   TryCatch(async () => {
      const { take, offset, orders } = req.body;

      const products = await prisma.product.findMany({
         where: {
            category: "Filters",
         },
         take,
         skip: offset,
         orderBy: {
            createdAt: orders,
         },
      });

      return res.json(products);
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

      return res.json(product);
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

      return res.json(products);
   })
);
export default router;
