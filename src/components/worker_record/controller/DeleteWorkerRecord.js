import ShopWorkerRecord from "../model/worker_record_model.js";
import ShopWorkerRecordMeta from "../model/worker_record_meta_model.js";

import db from "../../../config/db.js";

const deleteWorkerRecord = async (req, res) => {
    let recordId = req.query.record_id;
    const transaction = await db.sequelize.transaction();
    try {
      let record = await ShopWorkerRecord.findByPk(recordId, { transaction });
      if (!record) {
        return res.status(404).json({
          status: 404,
          message: "Worker not found",
        });
      }
  
      await ShopWorkerRecordMeta.destroy({
        where: { record_id: recordId },
        transaction,
      });
  
      await record.destroy({ transaction });
  
      await transaction.commit();
  
      return res.status(200).json({
        status: 200,
        message: "Worker records and associated records deleted successfully",
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: err,
      });
    }
  };

  export default deleteWorkerRecord;