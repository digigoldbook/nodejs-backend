import { v4 as uuidv4 } from "uuid";

import WorkerMetaModel from "../model/WorkerMetaModel.js";
import WorkerModel from "../model/WorkerModel.js";
import db from "../../../config/db.js";

const updateWorker = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      wrk_name,
      wrk_contact,
      wrk_address,
      wrk_department,
      wrk_opening_status,
      meta,
    } = req.body;

    // Update main worker data
    const worker = await WorkerModel.update(
      {
        wrk_name,
        wrk_contact,
        wrk_address,
        wrk_department,
        wrk_opening_status,
      },
      { where: { id }, transaction: t }
    );

    if (!worker[0]) {
      await t.rollback();
      return res.status(404).json({ status: 404, message: "Worker not found" });
    }

    // Update or create metadata
    await Promise.all(
      meta.map(async (m) => {
        await WorkerMetaModel.upsert(
          {
            worker_id: id,
            meta_key: m.meta_key,
            meta_value: m.meta_value,
          },
          { transaction: t }
        );
      })
    );

    await t.commit();
    return res.status(200).json({
      status: 200,
      message: "Worker updated successfully",
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      status: 500,
      message: `Server error: ${error}`,
    });
  }
};

export default updateWorker;
