import express from "express";
import multer from "multer";
import UpdateProfile from "../controllers/UpdateProfile.js";

import { fetchUsers } from "../controllers/GetUserController.js";
import { deleteUser } from "../controllers/DeleteUserController.js";
import { updateUserRole } from "../controllers/UpdateUserRole.js";
import { passwordReset } from "../controllers/PasswordReset.js";

import {
  authenticateToken,
  authorizeRoles,
} from "../../authentication/helper/AuthHelper.js";

const uRoute = express.Router();
const upload = multer();

uRoute.get("/", authenticateToken, authorizeRoles(["admin"]), fetchUsers);

uRoute.put("/edit-profile", upload.none(), UpdateProfile.updateUserProfile);

uRoute.put("/edit-role", upload.none(), authenticateToken, updateUserRole);

uRoute.put("/password-reset", upload.none(), passwordReset);

uRoute.delete("/delete-user", authenticateToken, deleteUser);

export default uRoute;
