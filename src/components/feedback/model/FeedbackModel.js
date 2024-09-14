import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class FeedbackModel extends Model {}

FeedbackModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "feedback",
    freezeTableName: true,
    timestamps: true,
  }
);

export default FeedbackModel;