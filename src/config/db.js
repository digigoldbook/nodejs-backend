import { Sequelize } from "sequelize";

let db_host = process.env.DB_HOST || "localhost";
let db_user = process.env.DB_USER || "root";
let db_pass = process.env.DB_PASS || "";
let db_name = process.env.DB_NAME ?? "project_gold";


const sequelize = new Sequelize(db_name, db_user, db_pass, {
  host: db_host,
  dialect: "mysql",
});

const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default {sequelize, authenticate};
