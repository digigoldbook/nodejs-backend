import { DataTypes, Model } from "sequelize";

import UserModel from "./UserModel.js";
import db from "../../../config/db.js";

class UserRoleModel extends Model {}

UserRoleModel.init(
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
    timestamps: false,
    freezeTableName: false,
  }
);

export default UserRoleModel;
