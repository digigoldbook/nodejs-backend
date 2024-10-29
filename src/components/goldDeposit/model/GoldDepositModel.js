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
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_title: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    serial_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unique_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    customer_contact: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    bank_bone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    item_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_amount: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
    },
    product_rate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 36.0,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    product_status: {
      type: DataTypes.STRING(16),
      defaultValue: "running",
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "shop",
        key: "id",
      },
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
