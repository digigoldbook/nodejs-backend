import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class RoleModel extends Model {}

RoleModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "user_role",
    freezeTableName: true,
    timestamps: false,
  }
);

export default RoleModel;
