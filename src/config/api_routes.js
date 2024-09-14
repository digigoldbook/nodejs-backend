import express from "express";
import {authenticateToken, authorizeRoles} from "../components/authentication/helper/AuthHelper.js";

const apiRoutes = express.Router();

apiRoutes.get("/", (req, res) =>
  res.status(200).json({ status: 200, message: "server is working" })
);

apiRoutes.get("/protected-route", authenticateToken, authorizeRoles(['admin']), (req, res) => {
 return res.json({
    message: "Access granted!",
    user: req.user,
  });
});

import aRoute from "../components/authentication/router/AuthRouter.js";
apiRoutes.use("/auth", aRoute);

import uRoute from "../components/users/routes/UserRoute.js";
apiRoutes.use("/users", uRoute);

import gRouter from "../components/gallery/router/GalleryRoute.js";
apiRoutes.use("/gallery", gRouter);

import roleRouter from "../components/roles/router/RoleRouter.js";
apiRoutes.use("/roles", roleRouter);

import catRoute from "../components/category/routes/CatRouter.js";
apiRoutes.use("/category", catRoute);

import workerRoute from "../components/worker/router/WorkerRouter.js";
apiRoutes.use("/worker", workerRoute);

import sRoute from "../components/shop/router/ShopRouter.js";
apiRoutes.use("/shops", sRoute);

import feedbackRoute from "../components/feedback/router/Feedbackrouter.js";
apiRoutes.use("/feedback", feedbackRoute);

export default apiRoutes;
