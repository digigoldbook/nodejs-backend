import { DataTypes, Model } from "sequelize";

import ShopModel from "./ShopModel.js";
import db from "../../../config/db.js";

class ShopMetaModel extends Model {}

ShopMetaModel.init(
  {
    meta_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ShopModel,
        key: 'id'
      },
    },
    meta_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meta_value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "shop_meta",
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export default ShopMetaModel;
