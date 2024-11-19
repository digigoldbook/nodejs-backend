import express from "express";
import multer from "multer";

import createCashDeposit from "../controller/CreateCashDeposit.js";

const cashRouter = express.Router();
const upload = multer();

cashRouter.get("/", createCashDeposit.fetchItems);
cashRouter.post("/", upload.none(), createCashDeposit.createCashDeposit);
cashRouter.delete("/", createCashDeposit.deleteCashDeposit);
cashRouter.put("/", createCashDeposit.editCashDeposit);

export default cashRouter;
