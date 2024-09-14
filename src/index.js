import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import 'dotenv/config';
import db from './config/db.js';
import {errorHandler} from "./components/authentication/helper/AuthHelper.js";

const app = express();

/**
 * use of middleware
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('tiny'));

// create connection of database
db.authenticate();
import WorkerAssociation from "./components/worker/model/WorkerAssociation.js";
import ShopAssociation from "./components/shop/model/ShopAssociation.js";
import GalleryAssoc from "./components/gallery/model/GalleryAssoc.js";
import UserAssoc from "./components/users/model/UserAssoc.js";
import CategoryAssoc from "./components/category/model/CategoryAssoc.js";

// API routes handling -> config -> api_routes.js
import apiRoutes from "./config/api_routes.js";
app.use("/", apiRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is loading at ${PORT}`)
});
