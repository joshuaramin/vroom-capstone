import express from "express";
import ServiceQuery from "./service.query.mjs";
import ServiceMutation from "./servcie.mutation.mjs";

const app = express.Router();

app.use("/services", ServiceQuery);
app.use("/services", ServiceMutation);

export default app;
