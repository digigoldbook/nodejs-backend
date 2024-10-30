import express from "express";

import fetchWorkerRecord from "../controller/FetchWorkerRecord.js";
import createWorkerRecord from "../controller/CreateWorkerRecord.js";
import deleteWorkerRecord from "../controller/DeleteWorkerRecord.js";
import updateWorkerRecord from "../controller/UpdateWorkerRecord.js";

const wRouter = express.Router();

wRouter.get("/", fetchWorkerRecord);
wRouter.post("/", createWorkerRecord);
wRouter.delete("/", deleteWorkerRecord);
wRouter.put("/", updateWorkerRecord);

export default wRouter;
