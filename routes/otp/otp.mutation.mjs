import express from "express";
import tryCatch from "../../middleware/trycatch.mjs";
import { prisma } from "../../server.mjs";
import { SENDMAIL } from "../../helpers/sengrid.mjs";

const router = express.Router();

router.post(
   "/createOTP",
   tryCatch(async (req, res) => {
      const { email } = req.body;
      const otps = await prisma.oTP.create({
         data: {
            otp,
         },
      });

      SENDMAIL(email, "OTP Verification", `OTP Message: ${otps.otp}`);

      res.json(otp);
   })
);

router.post(
   "/verifyMyOTP",
   tryCatch(async (req, res) => {
      const { otp } = req.body;

      const otps = await prisma.oTP.findUnique({
         where: {
            otp,
         },
      });

      if (!otps)
         throw new Error(
            "Your One-Time Password (OTP) did not match, please try again."
         );
      if (otps.expiredAt.getTime() < new Date().getTime())
         throw new Error(
            "One-Time Password (OTP) has expired, please try again."
         );

      res.json(otps);
   })
);

export default router;
