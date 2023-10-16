import express from "express";
import { prisma } from "../../server.mjs";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import tryCatch from "../../middleware/trycatch.mjs";
import { SENDMAIL } from "../../helpers/sengrid.mjs";
import { GenerateRandomOTP } from "../../helpers/randomGenerateOTP.mjs";
const { sign } = jsonwebtoken;
const router = express.Router();

router.post(
   "/createAdminAccount",
   tryCatch(async (req, res) => {
      const { password, email, firstname, lastname, phone } = req.body;

      if (!password || !email || !firstname || !lastname || !phone)
         throw new Error("Field should not be empty.");

      const pass = await bcryptjs.hash(password, 12);

      const users = await prisma.user.create({
         data: {
            email: email,
            password: pass,
            role: "admin",
            verified: true,
            profile: {
               create: {
                  firstname: firstname,
                  lastname: lastname,
                  phone: phone,
               },
            },
         },
      });

      res.json(users);
   })
);

router.post(
   "/createCustomer",
   tryCatch(async (req, res) => {
      const { password, email, firstname, lastname, phone, otps } = req.body;
      const dates = new Date();
      const pass = await bcryptjs.hash(password, 12);

      const otp = await prisma.oTP.create({
         data: {
            otp: GenerateRandomOTP(6),
            expiredAt: new Date(dates.getTime() + 5 * 60000),
         },
      });

      SENDMAIL(
         email,
         "OTP (one-time-password)",
         `<body style="box-sizing:  border-box; margin: 0; padding: 0;">
         <table style="width: 500px; height: auto; ">
             <tr style="height: 60px;">
                 <td style="font-family: Poppins;">Hello ${firstname} ${lastname}</h2>
                 </td>
             </tr>
             <tr style=" height: 60px;">
                 <td style="font-family: Poppins;">Your registration in Minerva Sales Corp. can be verified by
                     entering the OTP below.
                     <p>
                       <b>${otp.otp}</b>
                     </p>
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
     </body>`
      );

      const users = await prisma.user.create({
         data: {
            email,
            password: pass,
            role: "customer",
            verified: false,
            profile: {
               create: {
                  firstname,
                  lastname,
                  phone,
               },
            },
         },
      });


      res.json(users);
   })
);

router.post(
   "/login",
   tryCatch(async (req, res) => {
      const date = new Date();
      if (!req.body.email || !req.body.password)
         throw new Error("Field should not be empty");
      const loginUser = await prisma.user.findUnique({
         where: {
            email: req.body.email,
         },
      });

      if (loginUser.verified === false)
         throw new Error("You need to verify your account first");

      if (!loginUser) throw new Error("Email does not exist");

      const valid = await bcryptjs.compare(
         req.body.password,
         loginUser.password
      );

      if (!valid) throw new Error("Password is not match");

      const otps = await prisma.oTP.create({
         data: {
            otp: GenerateRandomOTP(8),
            expiredAt: new Date(date.getTime() + 5 * 60000),
            User: {
               connect: {
                  userID: loginUser.userID,
               },
            },
         },
      });

      SENDMAIL(loginUser.email, "OTP Verification", `OTP MESSAGE: ${otps.otp}`);

      const token = sign({ userID: loginUser.userID, role: loginUser.role }, "hello", {
         algorithm: "HS256",
         expiresIn: 60 * 60 * 24 * 7,
      });

      res.cookie("ecom_token", token);

      res.json(token);
   })
);

router.put(
   "/confirmation/:id",
   tryCatch(async (req, res) => {
      const users = await prisma.user.update({
         data: {
            verified: true,
         },
         where: { userID: req.params.id },
      });
      res.status(200).send("User is verifeid, go and login.");
      res.json(users);
   })
);

router.delete(
   "/deleteUser/:id",
   tryCatch(async (req, res) => {
      const users = await prisma.user.delete({
         where: { userID: req.params.id },
      });

      res.json(users);
   })
);

router.put(
   "/forgotPassword/:id",
   tryCatch(async (req, res) => {
      const pass = await bcryptjs.hash(req.body.password, 12);
      const users = await prisma.user.update({
         data: {
            password: pass,
            updatedAt: new Date(Date.now()),
            Logs: {
               create: {
                  title: "User Changed Password",
               },
            },
         },
         where: {
            userID: req.params.id,
         },
      });

      SENDMAIL(
         users.email,
         "Change Password OTP (One-Time-Password)",
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
                  <td style="font-family: Poppins;">Hello ${firstname} ${lastname}</h2>
                  </td>
              </tr>
              <tr style=" height: 60px;">
                  <td style="font-family: Poppins;">Your Password in Minerva Corp. can be reset by entering the OTP below.
                      <p>
                          ${otp.otp}
                      </p>
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
      res.json(users);
   })
);

router.put(
   "/changePassword/:id",
   tryCatch(async (req, res) => {
      const pass = await bcryptjs.hash(req.body.password, 12);

      const users = await prisma.user.update({
         data: {
            password: pass,
            Logs: {
               create: {
                  title: "User Changed Password",
               },
            },
         },
         where: {
            userID: req.params.id,
         },
      });
      res.json(users);
   })
);

router.patch(
   "/updateAccountDetails/:id",
   tryCatch(async (req, res) => {
      const pass = await bcryptjs.hash(req.body.password, 12);
      const { email, firstname, lastname, phone } = req.body;
      const users = await prisma.user.update({
         data: {
            password: pass,
            email,
            profile: {
               update: {
                  firstname,
                  lastname,
                  phone,
               },
            },
            Logs: {
               create: {
                  title: "User update their profile",
               },
            },
         },
         where: {
            userID: req.params.id,
         },
      });

      res.json(users);
   })
);

export default router;
