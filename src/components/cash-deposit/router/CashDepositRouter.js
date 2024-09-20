import express from "express";
import multer from "multer";

import createCashDeposit from "../controller/CreateCashDeposit.js";

const gRouter = express.Router();
const upload = multer();

gRouter.get("/", createCashDeposit.fetchItems);
gRouter.post("/", upload.none(), createCashDeposit.createCashDeposit);
gRouter.delete("/", createCashDeposit.deleteCashDeposit);

export default gRouter;
