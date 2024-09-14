import express from "express";
import multer from "multer";

import FeebbackController from "../controller/FeebbackController.js";

const app = express.Router();
const upload = multer();

app.get("/", FeebbackController.fetchItems);
app.post("/", upload.none(), FeebbackController.addItem);
app.put("/", upload.none(), FeebbackController.updateStatus);

export default app;
