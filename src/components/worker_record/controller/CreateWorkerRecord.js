import ShopWorkerRecord from "../model/worker_record_model.js";
import ShopWorkerRecordMeta from "../model/worker_record_meta_model.js";
import { v4 as uuidv4 } from "uuid";

const createWorkerRecord = async (req, res) => {
  try {
    const {
      given_date,
      end_date,
      given_net_weight,
      return_product_name,
      product_weight,
      wastage_weight,
      given_cash,
      result,
      meta,
    } = req.body;

    const workerRecord = await ShopWorkerRecord.create({
      given_date,
      end_date,
      unique_code: uuidv4(),
      given_net_weight,
      return_product_name,
      product_weight,
      wastage_weight,
      given_cash,
      result,
    });

    if (meta && Array.isArray(meta)) {
      const metaEntries = meta.map((m) => ({
        record_id: workerRecord.id,
        meta_key: m.meta_key,
        meta_value: m.meta_value,
      }));

      await ShopWorkerRecordMeta.bulkCreate(metaEntries);
    }

    return res.status(201).json({
      status: 201,
      message: "Worker record created successfully",
      data: workerRecord,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error: ${error.message}`,
    });
  }
};

export default createWorkerRecord;