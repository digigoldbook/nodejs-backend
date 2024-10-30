import { DataTypes, Model } from "sequelize";

import ShopWorkerRecord from "./worker_record_model.js";
import db from "../../../config/db.js";

class ShopWorkerRecordMeta extends Model {}

ShopWorkerRecordMeta.init(
  {
    meta_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ShopWorkerRecord,
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
    modelName: "shop_worker_record_meta",
    freezeTableName: true,
    timestamps: false,
  }
);

export default ShopWorkerRecordMeta;
