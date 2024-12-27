import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import db from "./src/config/db.js";
import { errorHandler } from "./src/components/authentication/helper/AuthHelper.js";

const app = express();

/**
 * use of middleware
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(cors());
app.options("*", cors);

// create connection of database
db.authenticate();
import "./src/components/worker_record/model/worker_record_association.js";
import WorkerAssociation from "./src/components/worker/model/WorkerAssociation.js";
import ShopAssociation from "./src/components/shop/model/ShopAssociation.js";
import GalleryAssoc from "./src/components/gallery/model/GalleryAssoc.js";
import UserAssoc from "./src/components/users/model/UserAssoc.js";
import CategoryAssoc from "./src/components/category/model/CategoryAssoc.js";

// API routes handling -> config -> api_routes.js
import apiRoutes from "./src/config/api_routes.js";
app.use("/api", apiRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is loading at ${PORT}`);
});

import redis from "redis";

let redisClient = redis.createClient({
  host: "localhost", // or your Redis server
  port: 6379, // default Redis port
});

redisClient.on("error", (err) => {
  console.error("Redis error: ", err);
});
