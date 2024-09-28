import GalleryMetaModel from "./GalleryMetaModel.js";
import GalleryModel from "./GalleryModel.js";

GalleryModel.hasMany(GalleryMetaModel, {
  foreignKey: "gallery_id",
  as: "meta",
});

GalleryMetaModel.belongsTo(GalleryModel, {
  foreignKey: "gallery_id",
  as: "gallery",
});

export default { GalleryModel, GalleryMetaModel };
