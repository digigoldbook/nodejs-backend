import { DataTypes, Model } from "sequelize";

import WorkerModel from "./WorkerModel.js";
import db from "../../../config/db.js";

class WorkerMetaModel extends Model {}

WorkerMetaModel.init(
  {
    meta_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    worker_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: WorkerModel,
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
    modelName: "shop_worker_meta",
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export default WorkerMetaModel;
