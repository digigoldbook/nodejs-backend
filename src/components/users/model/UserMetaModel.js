import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

import UserModel from "./UserModel.js";

class UserMetaModel extends Model {}

UserMetaModel.init(
  {
    meta_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id"
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
    tableName: "user_meta",
    freezeTableName: false,
    timestamps: false,
  }
);


export default UserMetaModel;
