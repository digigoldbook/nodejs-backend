import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class ShopModel extends Model {}

ShopModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    shop_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shop_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shop_contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shop_reg_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  },
  {
    sequelize: db.sequelize,
    modelName: "shop",
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

export default ShopModel;
