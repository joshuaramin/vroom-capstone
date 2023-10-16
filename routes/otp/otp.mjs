import express from "express";
import OTPMutation from "./otp.mutation.mjs";

const router = express.Router();

router.use("/otp", OTPMutation);

export default router;
