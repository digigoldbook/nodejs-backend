import ShopWorkerRecordMeta from "../model/worker_record_meta_model.js";
import ShopWorkerRecord from "../model/worker_record_model.js";

const fetchWorker = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 10;
    let sort = req.query.sort || "desc";

    let offset = (page - 1) * perPage;

    const workers = await ShopWorkerRecord.findAll({
      include: [{ model: ShopWorkerRecordMeta, as: "meta" }],
      order: [["id", sort.toUpperCase()]],
      limit: perPage,
      offset: offset,
    });

    let totalCount = await ShopWorkerRecord.count();

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
