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
    wrk_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wrk_contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wrk_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "worker",
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

export default WorkerModel;
