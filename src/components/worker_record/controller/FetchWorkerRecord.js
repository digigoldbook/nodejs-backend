import ShopWorkerRecordMeta from "../model/worker_record_meta_model.js";
import ShopWorkerRecord from "../model/worker_record_model.js";

const fetchWorker = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 10;
    let sort = req.query.sort || "desc";
    let workerId = parseInt(req.query.worker_id);

    let offset = (page - 1) * perPage;

    // Define include clause with conditionally applied where for worker_id
    const includeMeta = {
      model: ShopWorkerRecordMeta,
      as: "meta",
      required: true,
      where: workerId ? { meta_key: "worker_id", meta_value: workerId } : {},
    };

    // Fetch workers with pagination, sorting, and filtering by worker_id
    const workers = await ShopWorkerRecord.findAll({
      include: [includeMeta],
      order: [["id", sort.toUpperCase()]],
      limit: perPage,
      offset: offset,
    });

    // Count total records with worker_id filter if applied
    const totalCount = await ShopWorkerRecord.count({
      include: [includeMeta],
    });

    // Calculate pagination details
    let totalPages = Math.ceil(totalCount / perPage);
    let pagination = {
      currentPage: page,
      totalPages,
      perPage: perPage,
      totalCount: totalCount,
    };

    return res.status(200).json({
      status: 200,
      data: workers,
      pagination: pagination,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error: ${error.message}`,
    });
  }
};

export default fetchWorker;
