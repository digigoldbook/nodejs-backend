import ShopWorkerRecord from "./worker_record_model.js";
import ShopWorkerRecordMeta from "./worker_record_meta_model.js";

// Set up associations
ShopWorkerRecord.hasMany(ShopWorkerRecordMeta, {
  foreignKey: "record_id",
  as: "meta",
});

ShopWorkerRecordMeta.belongsTo(ShopWorkerRecord, {
  foreignKey: "record_id",
  as: "record",
});

export { ShopWorkerRecord, ShopWorkerRecordMeta };
