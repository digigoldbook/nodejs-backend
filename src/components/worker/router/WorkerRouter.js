import express from "express";

import createWorker from "../controller/CreateWorkerController.js";
import FetchWorkerController from "../controller/FetchWorkerController.js";
import deleteWorker from "../controller/DeleteWorkerController.js";
import updateWorker from "../controller/UpdateWorkerController.js"

const wRouter = express.Router();

wRouter.post("/", createWorker);
wRouter.get("/", FetchWorkerController.fetchWorker);
wRouter.get("/profile", FetchWorkerController.fetchWorkerById);
wRouter.delete("/", deleteWorker);
wRouter.put("/", updateWorker);

export default wRouter;
