import express from "express";
import multer from "multer";
import UserController from "../controllers/UserController.js";

import {
  authenticateToken,
  authorizeRoles,
} from "../../authentication/helper/AuthHelper.js";

const uRoute = express.Router();
const upload = multer();

uRoute.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  UserController.fetchUsers
);
uRoute.put(
  "/edit-role",
  upload.none(),
  authenticateToken,
  authorizeRoles(["admin"]),
  UserController.updateUserRole
);
uRoute.put("/password-reset", upload.none(), UserController.passwordReset);
uRoute.delete(
  "/delete-user",
  authenticateToken,
  authorizeRoles(["admin"]),
  UserController.deleteUser
);

export default uRoute;
