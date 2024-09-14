import { DataTypes, Model } from "sequelize";

import db from "../../../config/db.js";

class CategoryModel extends Model {}

CategoryModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    cat_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cat_slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cat_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "category",
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

export default CategoryModel;