import GalleryMetaModel from "./GalleryMetaModel.js";
import GalleryModel from "./GalleryModel.js";

GalleryModel.hasMany(GalleryMetaModel, {
  foreignKey: "post_id",
  as: "meta",
});

GalleryMetaModel.belongsTo(GalleryModel, {
  foreignKey: "post_id",
  as: "gallery",
});

export default { GalleryModel, GalleryMetaModel };
