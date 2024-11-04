import WorkerMetaModel from "../model/WorkerMetaModel.js";
import WorkerModel from "../model/WorkerModel.js";

const fetchWorker = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 10;
    let sort = req.query.sort || "desc";
    let shopId = req.query.shop_id; // Get shop_id from query params

    let offset = (page - 1) * perPage;

    // Define include clause with conditionally applied where for shop_id
    const includeMeta = {
      model: WorkerMetaModel,
      as: "meta",
      required: true, // Ensures only workers with meta records are included
      where: shopId ? { meta_key: "shop_id", meta_value: shopId } : {},
    };

    // Fetch workers with pagination, sorting, and filtering by shop_id
    const workers = await WorkerModel.findAll({
      include: [includeMeta],
      order: [["id", sort.toUpperCase()]],
      limit: perPage,
      offset: offset,
    });

    // Count total workers with shop_id filter if applied
    const totalCount = await WorkerModel.count({
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
