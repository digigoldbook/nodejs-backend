import WorkerMetaModel from "../model/WorkerMetaModel.js";
import WorkerModel from "../model/WorkerModel.js";
import db from "../../../config/db.js";

const deleteWorker = async (req, res) => {
    let workerId = req.query.worker_id;
    const transaction = await db.sequelize.transaction();
    try {
      let worker = await WorkerModel.findByPk(workerId, { transaction });
      if (!worker) {
        return res.status(404).json({
          status: 404,
          message: "Worker not found",
        });
      }
  
      await WorkerMetaModel.destroy({
        where: { worker_id: workerId },
        transaction,
      });
  
      await worker.destroy({ transaction });
  
      await transaction.commit();
  
      return res.status(200).json({
        status: 200,
        message: "Workers and associated records deleted successfully",
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: err,
      });
    }
  };

  export default deleteWorker;