import { DataTypes, Model } from "sequelize";

import db from "../../../config/db.js";

class UserModel extends Model {}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 50,
      },
    },
    contact_no: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        min: 5,
        max: 100,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 255,
      },
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "subscriber",
    },
    user_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "users",
    freezeTableName: true,
    timestamps: false,
  }
);

export default UserModel;
