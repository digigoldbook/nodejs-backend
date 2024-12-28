import { Op } from "sequelize";

import UserModel from "../model/UserModel.js";
import UserMetaModel from "../model/UserMetaModel.js";

export const fetchUsers = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "asc";
    let role = req.query.role;
    let fullname = req.query.fullname || ""; // Capture the fullname filter
    let offset = (page - 1) * limit;

    // Build the where clause for fullname and role
    let whereClause = {
      ...(fullname && { fullname: { [Op.like]: `%${fullname}%` } }), // Add fullname filter if provided
    };

    let users = await UserModel.findAll({
      where: whereClause, // Include where clause for fullname
      include: [
        {
          model: UserMetaModel,
          as: "meta",
        },
      ],
      order: [["id", sort.toUpperCase()]],
      limit: limit,
      offset: offset,
    });

    const totalCount = await UserModel.count({
      where: whereClause, // Include where clause for fullname in the count
      include: [
        {
          model: UserMetaModel,
          as: "meta",
        },
      ],
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      contact_no: user.contact_no,
      role: user.role,
      meta: user.meta.map((meta) => ({
        meta_key: meta.meta_key,
        meta_value: meta.meta_value,
      })),
    }));

    // Pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      limit,
      totalCount,
    };

    return res.status(200).json({
      status: 200,
      data: formattedUsers,
      pagination,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message || "Internal Server Error",
    });
  }
};

export default { fetchUsers };
