import GoldDepositModel from "../model/GoldDepositModel.js";

const goldDepositDelete = async (req, res) => {
  try {
    let { depositId } = req.query;

    await GoldDepositModel.destroy({
      where: {
        id: depositId,
      },
    });

    return res.status(200).json({
        status: 200,
        message: "Item has been deleted",
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error : ${error}`,
    });
  }
};

export default goldDepositDelete;