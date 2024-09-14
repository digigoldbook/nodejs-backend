import ShopMetaModel from "./ShopMetaModel.js";
import ShopModel from "./ShopModel.js";
import ShopWorkerModel from "./ShopWorkerModel.js";
import UserModel from "../../users/model/UserModel.js";

// Shop and ShopMeta association
ShopModel.hasMany(ShopMetaModel, {
  foreignKey: "shop_id",
  as: "meta",
});

ShopMetaModel.belongsTo(ShopModel, {
  foreignKey: "shop_id",
  as: "shop",
});

// Shop and ShopWorker association
ShopModel.hasMany(ShopWorkerModel, {
  foreignKey: "shop_id",
  as: "workers",
});

ShopWorkerModel.belongsTo(ShopModel, {
  foreignKey: "shop_id",
  as: "shop",
});

// ShopWorker and User association
ShopWorkerModel.belongsTo(UserModel, {
  foreignKey: "worker_id",
  as: "worker",
});

UserModel.hasMany(ShopWorkerModel, {
  foreignKey: "worker_id",
  as: "shopWorkers",
});

export default { ShopModel, ShopMetaModel, ShopWorkerModel, UserModel };
