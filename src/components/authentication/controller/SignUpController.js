import { v4 as uuidv4 } from "uuid";

import UserMetaModel from "../../users/model/UserMetaModel.js";
import UserModel from "../../users/model/UserModel.js";
import PasswordHelper from "../helper/PasswordHelper.js";
import db from "../../../config/db.js";
import { registerValidation } from "../schema/register.schema.js";
import sendRegistrationEmail from "../helper/EmailHelper.js";
import { token } from "morgan";

const signUpUser = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { error, value } = registerValidation.validate(req.body);

    if (error) {
      await transaction.rollback();
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    let { fullname, email, password, contact_no, role, meta } = value;
    password = PasswordHelper.encryptPassword(password);

    // generate otp
    const activationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const tokenExpiresAt = new Date(Date.now() + 5 * 60 * 1000 ); // 5 min from now

    let user_code = uuidv4();

    let user = await UserModel.create(
      {
        fullname,
        email,
        password,
        contact_no,
        role,
        user_code,
        activation_code: activationCode,
        token_expires_at: tokenExpiresAt,
      },
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
    await sendRegistrationEmail(email, activationCode);

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
