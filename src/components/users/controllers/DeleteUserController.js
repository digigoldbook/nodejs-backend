import UserModel from "../model/UserModel.js";
import UserMetaModel from "../model/UserMetaModel.js";

import db from "../../../config/db.js";

export const deleteUser = async (req, res) => {
    let userId = req.query.userId;
    const transaction = await db.sequelize.transaction();
    try {
      let user = await UserModel.findByPk(userId, { transaction });
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }
  
      await UserMetaModel.destroy({
        where: { user_id: userId },
        transaction,
      });
  
      await user.destroy({ transaction });
  
      await transaction.commit();
  
      return res.status(200).json({
        status: 200,
        message: "Users and associated records deleted successfully",
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: err,
      });
    }
  };