import express from "express";

import WorkerController from "../controller/WorkerController.js";

const wRouter = express.Router();

wRouter.post("/", WorkerController.createWorker);
wRouter.get("/", WorkerController.fetchWorker);
wRouter.delete("/", WorkerController.deleteWorker);

export default wRouter;
