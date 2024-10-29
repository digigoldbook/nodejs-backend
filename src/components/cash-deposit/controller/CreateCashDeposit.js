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
    const { id } = req.params;
    const {
      amount,
      rate,
      time,
      time_unit,
      customer_name,
      customer_contact,
      shop_id,
    } = req.body;

    // Find the existing cash deposit record by id
    let cashDeposit = await CashDeposiModel.findByPk(id);

    if (!cashDeposit) {
      return res.status(404).json({
        status: 404,
        message: "Cash deposit not found",
      });
    }

    // Update the cash deposit with new values
    cashDeposit.amount = amount || cashDeposit.amount;
    cashDeposit.rate = rate || cashDeposit.rate;
    cashDeposit.time = time || cashDeposit.time;
    cashDeposit.time_unit = time_unit || cashDeposit.time_unit;
    cashDeposit.customer_name = customer_name || cashDeposit.customer_name;
    cashDeposit.customer_contact =
      customer_contact || cashDeposit.customer_contact;
    cashDeposit.shop_id = shop_id || cashDeposit.shop_id;

    // Save the updated record to the database
    await cashDeposit.save();

    return res.status(200).json({
      status: 200,
      message: "Cash deposit updated successfully",
      cashDeposit,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error: ${error.message}`,
    });
  }
};

export default {
  createCashDeposit,
  fetchItems,
  deleteCashDeposit,
  editCashDeposit,
};
