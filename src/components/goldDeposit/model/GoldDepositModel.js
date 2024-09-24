import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class GoldDepositModel extends Model {}

GoldDepositModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    post_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "shop",
        key: "id",
      },
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "gold_deposit_record",
    freezeTableName: true,
    timestamps: true,
  }
);

export default GoldDepositModel;
