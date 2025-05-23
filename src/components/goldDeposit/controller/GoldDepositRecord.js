import GoldDepositModel from "../model/GoldDepositModel.js";

const depositRecord = async (req, res) => {
  try {
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    let sort = req.query.sort || "asc";
    let shopId = parseInt(req.query.shop_id);

    let offset = (page - 1) * limit;
    let whereClause = shopId ? { shop_id: shopId } : {};


    // Fetch records with pagination
    const records = await GoldDepositModel.findAll({
      limit,
      offset,
      order: [["id", sort.toUpperCase()]],
      where: whereClause,
    });

    // Filter the items by userId if provided
    const filteredRecords = records.map(record => {
      return {
        ...record.toJSON(),
        product_title: JSON.parse(record.product_title)
      };
    });

    const totalCount = await GoldDepositModel.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalCount / limit);

    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      limit,
      totalCount: totalCount,
    };

    // Respond with the filtered records and pagination info
    return res.status(200).json({
      status: 200,
      data: filteredRecords,
      pagination: pagination,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error: ${error.message}`,
    });
  }
};

export default depositRecord;
