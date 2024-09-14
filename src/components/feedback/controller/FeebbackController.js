import FeedbackModel from "../model/FeedbackModel.js";

const fetchItems = async (req, res) => {
  try {
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;

    let offset = (page - 1) * limit;

    let data = await FeedbackModel.findAll({
      limit: limit,
      offset: offset,
    });

    return res.status(200).json({
      status: 200,
      data,
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
