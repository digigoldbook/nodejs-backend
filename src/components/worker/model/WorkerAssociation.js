import WorkerMetaModel from "./WorkerMetaModel.js";
import WorkerModel from "./WorkerModel.js";

WorkerModel.hasMany(WorkerMetaModel, {
    foreignKey: 'worker_id',
    as: 'meta'
  });
  
WorkerMetaModel.belongsTo(WorkerModel, {
    foreignKey: 'worker_id',
    as: 'worker'
  });

export default {WorkerModel, WorkerMetaModel};
  