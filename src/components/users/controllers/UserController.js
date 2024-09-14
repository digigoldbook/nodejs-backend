import Joi from "joi";

import UserModel from "../model/UserModel.js";
import UserMetaModel from "../model/UserMetaModel.js";
import PasswordHelper from "../../authentication/helper/PasswordHelper.js";

import db from "../../../config/db.js";

const fetchUsers = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 10;

    let sort = req.query.sort || "asc";
    let role = req.query.role;
    let offset = (page - 1) * perPage;

    let users = await UserModel.findAll({
      include: [
        {
          model: UserMetaModel,
          as: "meta",
          where: role ? { meta_key: "role", meta_value: role } : {},
        },
      ],
      order: [["id", sort.toUpperCase()]],
      limit: perPage,
      offset: offset,
    });

    const totalCount = await UserModel.count({
      include: [
        {
          model: UserMetaModel,
          as: "meta",
          where: role ? { meta_key: "role", meta_value: role } : {},
        },
      ],
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      contact_no: user.contact_no,
      meta: user.meta.map((meta) => ({
        meta_key: meta.meta_key,
        meta_value: meta.meta_value,
      })),
    }));

    // Pagination metadata
    const totalPages = Math.ceil(totalCount / perPage);
    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      perPage: perPage,
      totalCount: totalCount,
    };

    return res.status(200).json({
      status: 200,
      data: formattedUsers,
      pagination: pagination,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message || "Internal Server Error",
    });
  }
};

const profileDetails = async (req, res) => {
  try {
    let { email } = req.query;
    let user = await UserModel.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({
        status: 400,
        message: `User not found`,
      });
    }
    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message || "Internal Server Error",
    });
  }
};

const deleteUser = async (req, res) => {
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

const passwordReset = async (req, res) => {
  try {
    const clientIp = req.clientIp;
    let email = req.query.email;

    let signInSchema = Joi.object({
      newPassword: Joi.string().min(8).required(),
      confirmPassword: Joi.string().min(8).required(),
    });

    const { error, value } = signInSchema.validate(req.body);

    // ----- Display error on the basis of schema
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    let { newPassword, confirmPassword } = value;

    // check the password entered by user matched or not!
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: 400,
        message: "Password did not matched",
      });
    }

    // search user existance of given email
    let user = await UserModel.findOne({
      where: {
        email,
      },
    });

    if (user === null) {
      return res.status(400).json({
        status: 400,
        message: "User not found",
      });
    }

    newPassword = PasswordHelper.encryptPassword(newPassword);
    let updateValue = await UserModel.update(
      { password: newPassword },
      {
        where: {
          email,
        },
      }
    );

    if (updateValue[0] === 0) {
      return res.status(400).json({
        status: 400,
        message: "Use of same Password",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Password has been updated",
      clientIp,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: `Internal server error ${error}`,
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    let { email, role } = req.body;
    let user = await UserModel.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: `User of ${email} not found`,
      });
    }

    let user_id = user["dataValues"]["id"];

    let userMeta = await UserMetaModel.findOne({
      where: {
        user_id,
        meta_key: "role",
      },
    });

    if (!userMeta) {
      return res.status(404).json({
        status: 404,
        message: `Role not found for user ${email}`,
      });
    }

    await UserMetaModel.update(
      { meta_value: role },
      {
        where: {
          user_id,
        },
      }
    );

    return res.status(200).json({
      status: 200,
      message: "Role has been updated",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: `Server error: ${error}`,
    });
  }
};

export default { fetchUsers, updateUserRole, passwordReset, deleteUser };
