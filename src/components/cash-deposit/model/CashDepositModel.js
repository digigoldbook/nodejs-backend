import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class CashDepositModel extends Model {}

CashDepositModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time_unit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "month",
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_contact: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "shop", 
        key: "id",
      },
      onDelete: "cascade",
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "cash_deposit",
    freezeTableName: true,
    timestamps: true,
  }
);

export default CashDepositModel;
