import WorkerMetaModel from "../model/WorkerMetaModel.js";
import WorkerModel from "../model/WorkerModel.js";
import db from "../../../config/db.js";

const createWorker = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    let { wrk_name, wrk_contact, wrk_address, meta } = req.body;

    let worker = await WorkerModel.create(
      {
        wrk_name,
        wrk_contact,
        wrk_address,
      },
      { transaction: t }
    );

    const metaData = meta.map((m) => ({
      worker_id: worker.id,
      meta_key: m.meta_key,
      meta_value: m.meta_value,
    }));

    const workerMeta = await WorkerMetaModel.bulkCreate(metaData, {
      transaction: t,
    });
    await t.commit();
    return res.status(201).json({
      status: 201,
      data: { worker, workerMeta },
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      status: 500,
      message: `Server error : ${error}`,
    });
  }
};

const fetchWorker = async (req, res) => {
  try {
    const workers = await WorkerModel.findAll({
      include: [{ model: WorkerMetaModel, as: "meta" }],
    });

    return res.status(200).json({
      status: 200,
      data: workers,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error: ${error.message}`,
    });
  }
};

const deleteWorker = async (req, res) => {
  try {
    let wrkId = req.query.wrkId;
    let value = await WorkerModel.destroy({
      where: {
        id: wrkId,
      },
    });
    if (value === 0) {
      return res.status(404).json({
        status: 404,
        message: "Worker not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Worker deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error: ${error.message}`,
    });
  }
};

export default { createWorker, fetchWorker, deleteWorker };
