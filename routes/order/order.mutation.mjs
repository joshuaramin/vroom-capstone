import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";
import { SENDMAIL } from "../../helpers/sengrid.mjs";
import { GenerateRandomORDER } from "../../helpers/randomGenerateORDER.mjs";
import TryCatch from "../../middleware/trycatch.mjs";

const router = express.Router();

router.post(
   "/createOrders",
   tryCatch(async (req, res) => {
      const { productID, quantity, payment, userID } = req.body;

      const users = await prisma.user.findUnique({
         where: {
            userID,
         },
         include: {
            profile: true,
         },
      });

      if (!users.verified)
         throw new Error("You must need to be verified to create an oreder");

      const prod = await prisma.product.findUnique({
         where: {
            productID,
         },
      });

      const order = await prisma.orders.create({
         data: {
            orders: `#${GenerateRandomORDER(8)}`,
            payment,
            Product: {
               connect: {
                  productID: prod.productID,
               },
            },
            User: {
               connect: {
                  userID,
               },
            },
            total: prod.price * quantity,
            status: "Pending",
         },
      });

      SENDMAIL(
         users.email,
         "Waiting Payment Confirmation",
         `<html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="/index.css" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Oxygen&family=Arial:wght@200&family=Rubik&display=swap"
              rel="stylesheet">
          <title>Document</title>
      
      <body style="box-sizing:  border-box; margin: 0; padding: 0;">
          <table style="width: 500px; height: auto; ">
              <tr style="height: 60px;">
                  <td style="font-family: Poppins;">Hello ${users.profile.firstname} ${users.profile.lastname}</h2>
                  </td>
              </tr>
              <tr style=" height: 60px;">
                  <td style="font-family: Poppins;">Your payment for order ${order.orders} as been received. Your order is being
                      processed as of the moment. We will notify you again via email once there are updates.
                  </td>
              </tr>
              <tr style="height: 60px;">
                  <td style="font-family: Poppins;">
                      For any inquries, log in to your Minerva Sales Corp. Account and inquire via chatbox or message our
                      Facebook page. Thank you.
                  </td>
              </tr>
              <tr style="height: 60px;">
                  <td style="font-family: Poppins;">
                      If you did not request a new password, please ignore this email
                  </td>
              </tr>
              <tr style="height: 30px; ">
                  <td style="width: 100%; text-align: center; ">
                      <img src="
                  http://cdn.mcauto-images-production.sendgrid.net/c19fbca0252c8257/91bb1b2a-746f-431b-97d7-482bdcdbad63/1537x546.png"
                          alt="minerva.logo" height="100" width="300" />
                  </td>
              </tr>
              <tr>
                  <td style="text-align: center; height: 35px;">
                      <p style="font-family: Poppins; height: 0;">
                          Sent by Minerva Sales Corp
                      </p>
                  </td>
              </tr>
              <tr>
                  <td style="text-align: center; height: 35px;">
                      <p style="font-family: Poppins; height: 0;">
                          General Malvar Street, Barangay Tubigan, Binan City, Laguna, 4024
                      </p>
                  </td>
              </tr>
          </table>
      </body>
      
          </html>`
      );

      await prisma.logs.create({
         data: {
            title: "Submitted Order",
            User: {
               connect: {
                  userID,
               },
            },
         },
      });
      res.json(order);
   })
);

router.post(
   "/orderCancellation/:id",
   TryCatch(async (req, res) => {
      const orders = await prisma.orders.update({
         data: {
            status: "Order Cancelled",
         },
         where: {
            orderID: req.params.id,
         },
         include: {
            User: true,
         },
      });

      const users = await prisma.user.findMany({
         where: {
            Orders: {
               some: {
                  orders: orders.orderID,
               },
            },
         },
         include: {
            profile: true,
         },
      });

      SENDMAIL(
         users[0].email,
         `Order Cancelled`,
         `<html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="/index.css" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Oxygen&family=Arial:wght@200&family=Rubik&display=swap"
              rel="stylesheet">
          <title>Document</title>
      
      <body style="box-sizing:  border-box; margin: 0; padding: 0;">
          <table style="width: 500px; height: auto; ">
              <tr style="height: 60px;">
                  <td style="font-family: Poppins;">Hello ${users[0].profile.firstname} ${users[0].profile.lastname}</h2>
                  </td>
              </tr>
              <tr style=" height: 60px;">
                  <td style="font-family: Poppins;">Your order ${orders.orders} has been canceled. We hope to do business with you
                      again. For more details regarding the cancellation, kindly login and view the order status.
                  </td>
              </tr>
              <tr style=" height: 60px;">
                  <td style="font-family: Poppins;">
                      For any inquires, log in to your Minerva Sales Corp. account and inquire via chatbox or message our
                      Facebook page. Thank you.
                  </td>
              </tr>
              <tr style="height: 60px;">
                  <td style="font-family: Poppins;">
                      If you did
                      not request
                      verification, please ignore this email
                  </td>
              </tr>
              <tr style="height: 30px; ">
                  <td style="width: 100%; text-align: center; ">
                      <img src="
                      http://cdn.mcauto-images-production.sendgrid.net/c19fbca0252c8257/91bb1b2a-746f-431b-97d7-482bdcdbad63/1537x546.png"
                          alt="minerva.logo" height="100" width="300" />
                  </td>
              </tr>
              <tr>
                  <td style="text-align: center; height: 35px;">
                      <p style="font-family: Poppins; height: 0;">
                          Sent by Minerva Sales Corp
                      </p>
                  </td>
              </tr>
              <tr>
                  <td style="text-align: center; height: 35px;">
                      <p style="font-family: Poppins; height: 0;">
                          General Malvar Street, Barangay Tubigan, Binan City, Laguna, 4024
                      </p>
                  </td>
              </tr>
          </table>
      </body>
      
      </html>`
      );

      await prisma.logs.create({
         data: {
            title: "Submitted order cancellation request",
            User: {
               connect: {
                  userID: users[0].userID,
               },
            },
         },
      });
      return res.json(orders);
   })
);

router.post(
   "/generateReport",
   TryCatch(async (req, res) => {
      const { startDate, endDate, userID } = req.body;

      const orders = await prisma.orders.findMany({
         where: {
            createdAt: {
               lte: startDate,
               gte: endDate,
            },
         },
      });

      await prisma.archive.create({
         data: {
            startDate,
            endDate,
         },
      });

      await prisma.logs.create({
         data: {
            title: "Generated Report",
            User: {
               connect: {
                  userID,
               },
            },
         },
      });

      return res.json(orders);
   })
);

router.put(
   "/updateOrderStatus/:id",
   tryCatch(async (req, res) => {
      const { status, adminUserID } = req.body;

      const orders = await prisma.orders.update({
         data: {
            status,
            updatedAt: new Date(Date.now()),
         },
         where: {
            orderID: req.params.id,
         },
         include: {
            User: {
               include: {
                  profile: true,
               },
            },
         },
      });

      switch (orders.status) {
         case "Ready for pick-up":
            SENDMAIL(
               orders.User[0].email,
               "Ready for Pick-up",
               `<html lang="en">
                  <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <link href="/index.css" rel="stylesheet" />
                  <link href="https://fonts.googleapis.com/css2?family=Oxygen&family=Arial:wght@200&family=Rubik&display=swap"
                     rel="stylesheet">
                  <title>Document</title>
                     <body style="box-sizing:  border-box; margin: 0; padding: 0;">
                        <table style="width: 500px; height: auto; ">
                           <tr style="height: 60px;">
                                 <td style="font-family: Poppins;">Hello ${orders.User[0].profile.firstname} ${orders.User[0].profile.lastname}</h2>
                                 </td>
                           </tr>
                           <tr style=" height: 60px;">
                                 <td style="font-family: Poppins;">Your order ${orders.orders} is now ready for pickup. Kindly bring the
                                    acknowledgment receipt or order form as proof of your transaction.
                                 </td>
                           </tr>
                           <tr style="height: 60px;">
                                 <td style="font-family: Poppins;">
                                    For any inquries, log in to your Minerva Sales Corp. Account and inquire via chatbox or message our
                                    Facebook page. Thank you.
                                 </td>
                           </tr>
                           <tr style="height: 60px;">
                                 <td style="font-family: Poppins;">
                                    If you did not request a new password, please ignore this email
                                 </td>
                           </tr>
                           <tr style="height: 30px; ">
                                 <td style="width: 100%; text-align: center; ">
                                    <img src="
                                 http://cdn.mcauto-images-production.sendgrid.net/c19fbca0252c8257/91bb1b2a-746f-431b-97d7-482bdcdbad63/1537x546.png"
                                       alt="minerva.logo" height="100" width="300" />
                                 </td>
                           </tr>
                           <tr>
                                 <td style="text-align: center; height: 35px;">
                                    <p style="font-family: Poppins; height: 0;">
                                       Sent by Minerva Sales Corp
                                    </p>
                                 </td>
                           </tr>
                           <tr>
                                 <td style="text-align: center; height: 35px;">
                                    <p style="font-family: Poppins; height: 0;">
                                       General Malvar Street, Barangay Tubigan, Binan City, Laguna, 4024
                                    </p>
                                 </td>
                           </tr>
                        </table>
                     </body>
      </html>
            `
            );
            break;
      }

      await prisma.logs.create({
         data: {
            title: "Edited Order Details",
            User: {
               connect: {
                  userID: adminUserID,
               },
            },
         },
      });

      res.json(orders);
   })
);

export default router;
