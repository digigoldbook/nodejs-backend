import CategoryModel from "./CategoryModel.js";
import CategoryMetaModel from "./CategoryMeta.js";

CategoryModel.hasMany(CategoryMetaModel, {
  foreignKey: "cat_id",
  as: "meta",
  onDelete: "CASCADE",
});
CategoryMetaModel.belongsTo(CategoryModel, {
  foreignKey: "cat_id",
  as: "category",
});

export default { CategoryModel, CategoryMetaModel };
