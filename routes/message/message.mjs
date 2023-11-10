import MessageMutation from "./message.mutation.mjs";
import MessageQuery from "./message.query.mjs";

import express from "express";

const router = express.Router();

router.use("/t", MessageQuery);
router.use("/t", MessageMutation);

export default router;
