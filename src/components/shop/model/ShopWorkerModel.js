import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class ShopWorkerModel extends Model {}

ShopWorkerModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    worker_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "shop_worker",
    freezeTableName: true,
    createdAt: true,
    updatedAt: false,
  }
);

export default ShopWorkerModel;
