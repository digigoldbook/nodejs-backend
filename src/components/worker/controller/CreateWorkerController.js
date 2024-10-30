import { v4 as uuidv4 } from "uuid";

import WorkerMetaModel from "../model/WorkerMetaModel.js";
import WorkerModel from "../model/WorkerModel.js";
import db from "../../../config/db.js";

const createWorker = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    let {
      wrk_name,
      wrk_contact,
      wrk_address,
      wrk_department,
      wrk_opening_status,
      meta,
    } = req.body;

    let wrk_unique_id = uuidv4();

    let worker = await WorkerModel.create(
      {
        wrk_unique_id,
        wrk_name,
        wrk_contact,
        wrk_address,
        wrk_department,
        wrk_opening_status,
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

export default createWorker;
