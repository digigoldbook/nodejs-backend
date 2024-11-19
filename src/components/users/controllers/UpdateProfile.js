import Joi from "joi";
import UserModel from "../../users/model/UserModel.js";
import db from "../../../config/db.js";

const updateUserProfile = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const updateProfileSchema = Joi.object({
      fullname: Joi.string().min(3).max(50).optional(),
      email: Joi.string().email().optional(),
      contact_no: Joi.number().optional(),
    });

    const { error, value } = updateProfileSchema.validate(req.body);

    if (error) {
      await transaction.rollback();
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const { fullname, email, contact_no } = value;

    // Assume user ID is available in `req.user` after authentication middleware
    const userId = req.user.id;

    // Check if the user exists
    const user = await UserModel.findByPk(userId);
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    // Update UserModel fields
    await UserModel.update(
      { fullname, email, contact_no },
      { where: { id: userId }, transaction }
    );

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      status: 200,
      message: "User profile updated successfully",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();

    console.error("Error in updating profile:", error);
    return res.status(500).json({
      status: 500,
      error: `Internal server error: ${error.message}`,
    });
  }
};

export default { updateUserProfile };
