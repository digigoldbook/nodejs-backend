import GoldDepositModel from "../model/GoldDepositModel.js";

const newGoldDeposit = async (req, res) => {
  try {
    let { items, post_title, shop_id } = req.body;

    const currentTimestamp = new Date();
    items = items.map((item) => ({
      ...item,
      status: "running",
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
    }));

    const data = await GoldDepositModel.create({
      items,
      shop_id,
      post_title,
    });

    return res.status(201).json({
      status: 201,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error : ${error}`,
    });
  }
};

export default newGoldDeposit;
