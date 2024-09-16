import express from "express";
import multer from "multer";

import newGoldDeposit from '../controller/NewGoldDeposit.js';
import depositRecord from '../controller/GoldDepositRecord.js';
import goldDepositDelete from "../controller/GoldDepositDelete.js";

const route = express.Router();
let upload = multer();

route.post("/", upload.none(), newGoldDeposit);
route.get("/",  depositRecord);
route.delete("/", goldDepositDelete);

export default route;
