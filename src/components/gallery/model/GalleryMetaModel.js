import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class GalleryMetaModel extends Model {}

GalleryMetaModel.init(
  {
    meta_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: "design_gallery_meta",
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export default GalleryMetaModel;
