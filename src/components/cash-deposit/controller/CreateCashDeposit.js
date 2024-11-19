import CashDeposiModel from "../model/CashDepositModel.js";

const createCashDeposit = async (req, res) => {
  try {
    let {
      amount,
      rate,
      start_date,
      end_date,
      customer_name,
      customer_contact,
      shop_id,
    } = req.body;

    let item = await CashDeposiModel.create({
      amount,
      rate,
      start_date,
      end_date,
      customer_name,
      customer_contact,
      shop_id,
    });

    if (!item) {
      return res.status(400).json({
        status: 400,
        message: "Unable to add item",
      });
    }

    return res.status(201).json({
      status: 201,
      item,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error: ${error}`,
    });
  }
};


const fetchItems = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 10;
    let sort = req.query.sort || "asc";
    let shopId = parseInt(req.query.shop_id);

    let offset = (page - 1) * perPage;
    let whereClause = shopId ? { shop_id: shopId } : {};

    let data = await CashDeposiModel.findAll({
      where: whereClause,
      order: [["id", sort.toUpperCase()]],
      limit: perPage,
      offset: offset,
    });

    let totalCount = await CashDeposiModel.count({
      where: whereClause,
    });

    let totalPages = Math.ceil(totalCount / perPage);
    let pagination = {
      currentPage: page,
      totalPages: totalPages,
      perPage: perPage,
      totalCount: totalCount,
    };

    return res.status(200).json({
      status: 200,
      data,
      pagination: pagination,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error: ${error}`,
    });
  }
};

const deleteCashDeposit = async (req, res) => {
  try {
    let itemId = req.query.itemId;
    let result = await CashDeposiModel.destroy({
      where: {
        id: itemId,
      },
    });
    if (result === 0) {
      return res.status(400).json({
        status: 400,
        message: "Unable to delete item",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error: ${error}`,
    });
  }
};

const editCashDeposit = async (req, res) => {
  try {
    const { id } = req.query.itemId;
    const {
      amount,
      rate,
      start_date,
      end_date,
      customer_name,
      customer_contact,
      shop_id,
    } = req.body; 

    // Find the record by ID
    const item = await CashDeposiModel.findByPk(id);

    if (!item) {
      return res.status(404).json({
        status: 404,
        message: "Item not found",
      });
    }

    // Update the record with new data
    await item.update({
      amount,
      rate,
      start_date,
      end_date,
      customer_name,
      customer_contact,
      shop_id,
    });

    return res.status(200).json({
      status: 200,
      message: "Item updated successfully",
      item,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error: ${error}`,
    });
  }
};


export default {
  createCashDeposit,
  fetchItems,
  deleteCashDeposit,
  editCashDeposit,
};
