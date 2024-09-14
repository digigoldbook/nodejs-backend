import express from "express";

import RoleController from "../controller/RoleController.js";

const roleRouter = express.Router();

roleRouter.post("/", RoleController.createRole);
roleRouter.get("/", RoleController.fetchRoles);
roleRouter.put("/", RoleController.updateRole);
roleRouter.delete("/", RoleController.deleteRole);

export default roleRouter;
