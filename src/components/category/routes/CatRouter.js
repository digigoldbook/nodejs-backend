import express from "express";
import multer from "multer";

import CategoryController from "../controller/CategoryController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../../authentication/helper/AuthHelper.js";

const catRoute = express.Router();
const upload = multer();

catRoute.get("/", CategoryController.getCategoriesWithMeta);
catRoute.post(
  "/add-category",
  authenticateToken,
  authorizeRoles(["admin"]),
  upload.none(),
  CategoryController.addCategory
);
catRoute.post(
  "/add-meta-category",
  authenticateToken,
  authorizeRoles(["admin"]),
  upload.none(),
  CategoryController.addMetaToCategory
);
catRoute.delete(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  CategoryController.deleteCategory
);
catRoute.put(
  "/edit-category",
  upload.none(),
  authenticateToken,
  authorizeRoles(["admin"]),
  CategoryController.updateCategory
);
catRoute.put(
  "/edit-category-meta",
  upload.none(),
  authenticateToken,
  authorizeRoles(["admin"]),
  CategoryController.updateCategoryMeta
);

export default catRoute;
