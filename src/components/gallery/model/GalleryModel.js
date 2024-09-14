import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class GalleryModel extends Model {}

GalleryModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    post_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "design_gallery",
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

export default GalleryModel;
