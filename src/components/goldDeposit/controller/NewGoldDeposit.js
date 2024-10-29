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
      product_status,
      item_count,
      product_title,
      start_date,
      end_date,
    } = req.body;

    const currentTimestamp = new Date();

    let day = String(currentTimestamp.getDate()).padStart(2, '0');
    let year = String(currentTimestamp.getFullYear()).slice(-2);

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

    // Validate and parse start_date and end_date
    const parsedStartDate = start_date ? new Date(start_date) : currentTimestamp;
    const parsedEndDate = end_date ? new Date(end_date) : new Date(parsedStartDate);

    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({
        status: 400,
        message: "End date must be after the start date.",
      });
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
      start_date: parsedStartDate,
      end_date: parsedEndDate,
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
