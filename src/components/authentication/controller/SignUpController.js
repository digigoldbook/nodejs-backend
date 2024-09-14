import Joi from "joi";

import UserMetaModel from "../../users/model/UserMetaModel.js";
import UserModel from "../../users/model/UserModel.js";
import PasswordHelper from "../helper/PasswordHelper.js";
import db from "../../../config/db.js";

const signUpUser = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const signUpSchema = Joi.object({
      fullname: Joi.string().min(3).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      contact_no: Joi.number().required(),
      meta: Joi.array()
        .items(
          Joi.object({
            meta_key: Joi.string().required(),
            meta_value: Joi.string().required(),
          })
        )
        .optional(),
    });

    const { error, value } = signUpSchema.validate(req.body);

    if (error) {
      await transaction.rollback();
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    let { fullname, email, password, contact_no, meta } = value;
    password = PasswordHelper.encryptPassword(password);

    let user = await UserModel.create(
      { fullname, email, password, contact_no },
      { transaction }
    );

    if (meta && Array.isArray(meta)) {
      const userMetaPromises = meta.map((metaItem) => {
        return UserMetaModel.create(
          {
            user_id: user.id,
            meta_key: metaItem.meta_key,
            meta_value: metaItem.meta_value,
          },
          { transaction }
        );
      });

      await Promise.all(userMetaPromises);
    }

    // Commit the transaction before returning a response
    await transaction.commit();

    // Send registration email
    // await sendRegistrationEmail(email);

    return res.status(201).json({
      status: 201,
      message: "User Account has been created",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();

    console.error("Error in sign up:", error);
    return res.status(500).json({
      status: 500,
      error: `Internal server error: ${error.message}`,
    });
  }
};

export default { signUpUser };
