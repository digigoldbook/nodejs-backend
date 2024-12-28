import FeedbackModel from "../model/FeedbackModel.js";

const fetchItems = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "asc";

    let offset = (page - 1) * limit;

    let data = await FeedbackModel.findAll({
      order: [["id", sort.toUpperCase()]],
      limit: limit,
      offset: offset,
    });

    const totalCount = await FeedbackModel.count({});

    const totalPages = Math.ceil(totalCount / limit);
    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      limit,
      totalCount,
    };

    return res.status(200).json({
      status: 200,
      data,
      pagination
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Internal Server Error : ${error}`,
    });
  }
};

const addItem = async (req, res) => {
  try {
    let data = await FeedbackModel.create(req.body);
    return res.status(201).json({
      status: 201,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Internal Server Error : ${error}`,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    let id = req.query.id;
    let sts = req.body.status;

    let item = await FeedbackModel.findByPk(id);

    if (!item) {
      return res.status(404).json({
        status: 404,
        message: "Item not found",
      });
    }

    await FeedbackModel.update(
      {
        status: sts,
      },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json({
      status: 200,
      message: "Item has been updated",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Internal Server Error : ${error}`,
    });
  }
};

export default { fetchItems, addItem, updateStatus };
