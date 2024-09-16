import GoldDepositModel from "../model/GoldDepositModel.js";

const depositRecord = async (req, res) => {
  try {
    // Read query parameters
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    let offset = (page - 1) * limit;
    let sort = req.query.sort || "asc";
    let userId = parseInt(req.query.userId, 10);


    // Fetch records with pagination
    const records = await GoldDepositModel.findAll({
        limit,
        offset,
        order: [["id", sort.toUpperCase()]],
      });
  
      // Convert JSON string to objects and filter by userId
      const filteredRecords = records.map(record => {
        const items = JSON.parse(record.items);
        const filteredItems = userId ? items.filter(item => item.userId === userId) : items;
        return {
          ...record.toJSON(),
          items: filteredItems
        };
      });
  
      // Count total number of records before filtering
      const totalCount = await GoldDepositModel.count();
  
      // Calculate total pages
      const totalPages = Math.ceil(totalCount / limit);
  
      // Create pagination info
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
