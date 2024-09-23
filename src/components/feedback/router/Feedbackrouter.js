import express from "express";
import multer from "multer";

import FeebbackController from "../controller/FeebbackController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../../authentication/helper/AuthHelper.js";

const app = express.Router();
const upload = multer();

app.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  FeebbackController.fetchItems
);
app.post("/", upload.none(), FeebbackController.addItem);
app.put(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  upload.none(),
  FeebbackController.updateStatus
);

export default app;
