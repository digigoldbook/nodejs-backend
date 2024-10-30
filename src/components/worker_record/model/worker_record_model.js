import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class ShopWorkerRecord extends Model {}

ShopWorkerRecord.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    given_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    unique_code: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    given_net_weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    return_product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    product_weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    wastage_weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    given_cash: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
    result: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: db.sequelize,
    modelName: "shop_worker_record",
    freezeTableName: true,
  }
);

export default ShopWorkerRecord;
