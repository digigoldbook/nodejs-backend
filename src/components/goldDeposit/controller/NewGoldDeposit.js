import GoldDepositModel from "../model/GoldDepositModel.js";
import { v4 as uuidv4 } from "uuid";

const newGoldDeposit = async (req, res) => {
  try {
    let {
      product_name,
      shop_id,
      unique_code,
      customer_name,
      customer_contact,
      bank_bone_number,
      product_amount,
      product_rate,
      duration,
      product_status,
      item_count,
      product_title,
    } = req.body;

    const currentTimestamp = new Date();

    let day = String(currentTimestamp.getDate()).padStart(2, '0');
    let year =  String(currentTimestamp.getFullYear()).slice(-2);

    let serial_no = `${day}${year}-${uuidv4().slice(0, 8)}`;


    // Ensure that product_title is an array of items and map through them
    const formattedProductTitle = product_title.map((item) => ({
      ...item,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
    }));

    if (unique_code === "") {
      unique_code = serial_no;
    }

    // Insert the data into the model
    const data = await GoldDepositModel.create({
      product_name,
      product_title: formattedProductTitle,
      serial_no,
      unique_code,
      customer_name,
      customer_contact,
      bank_bone_number,
      item_count,
      product_amount,
      product_rate,
      duration,
      product_status,
      shop_id,
    });

    return res.status(201).json({
      status: 201,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error: ${error}`,
    });
  }
};

export default newGoldDeposit;
