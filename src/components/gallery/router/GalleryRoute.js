import express from "express";
import multer from "multer";

import GalleryController from "../controller/GalleryController.js";
import GalleryS3Controller from "../controller/GalleryS3Controller.js";

const gRouter = express.Router();
const upload = multer();

gRouter.get("/", GalleryController.fetchPosts);

gRouter.get("/list-s3-items", GalleryS3Controller.listImages);
gRouter.post("/upload", upload.single("file"), GalleryController.uploadImage);
gRouter.delete("/delete-post", GalleryController.deletePost);

export default gRouter;
