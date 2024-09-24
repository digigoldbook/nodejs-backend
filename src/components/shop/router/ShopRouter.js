import express from "express";
import multer from "multer";
import ShopController from "../controller/ShopController.js";

import {
  authenticateToken,
} from "../../authentication/helper/AuthHelper.js";

const sRoute = express.Router();
let upload = multer();

sRoute.get("/", authenticateToken, ShopController.fetchShops);
sRoute.post("/", authenticateToken, upload.none(), ShopController.addShop);
sRoute.delete("/", authenticateToken, ShopController.deleteShop);
sRoute.put("/", authenticateToken, ShopController.updateShop);

export default sRoute;
