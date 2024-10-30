import express from "express";

import createWorker from "../controller/CreateWorkerController.js";
import fetchWorker from "../controller/FetchWorkerController.js";
import deleteWorker from "../controller/DeleteWorkerController.js";

const wRouter = express.Router();

wRouter.post("/", createWorker);
wRouter.get("/", fetchWorker);
wRouter.delete("/", deleteWorker);

export default wRouter;
