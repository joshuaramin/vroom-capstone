import MessageMutation from "./message.mutation.mjs";
import MessageQuery from "./message.query.mjs";

import express from "express";

const app = express.Router();

app.use("/t", MessageQuery);
app.use("/t", MessageMutation);

export default app;
