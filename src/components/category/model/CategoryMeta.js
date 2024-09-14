import { DataTypes, Model } from "sequelize";

import CategoryModel from "./CategoryModel.js";
import db from "../../../config/db.js";

class CategoryMetaModel extends Model {}

CategoryMetaModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    cat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CategoryModel,
        key: "id",
      },
    },
    meta_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meta_value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "category_meta",
    freezeTableName: true,
    timestamps: false,
  }
);

export default CategoryMetaModel;
