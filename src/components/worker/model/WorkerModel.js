import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class WorkerModel extends Model {}

WorkerModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    wrk_unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wrk_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wrk_contact: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    wrk_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wrk_department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wrk_opening_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "shop_worker",
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

export default WorkerModel;
