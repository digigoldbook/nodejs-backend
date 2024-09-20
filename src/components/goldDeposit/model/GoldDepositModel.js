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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
