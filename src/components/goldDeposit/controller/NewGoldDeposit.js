import GoldDepositModel from "../model/GoldDepositModel.js";

const newGoldDeposit = async (req, res) => {
  try {
    const { items, userId } = req.body;

    const data = await GoldDepositModel.create({
      items,userId
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
