import slugs from "slugs";
import RoleModel from "../model/RoleModel.js";

const fetchRoles = async (req, res) => {
  try {
    let items = await RoleModel.findAll();

    return res.status(200).json({
      status: 200,
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server Response : ${error}`,
    });
  }
};

const createRole = async (req, res) => {
  try {
    let { role_name } = req.body;
    let role_slug = slugs(role_name);

    let response = await RoleModel.create({ role_name, role_slug });

    return res.status(201).json({
      status: 201,
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server Response : ${error}`,
    });
  }
};

const updateRole = async (req, res) => {
  try {
    let { roleId } = req.query;
    let { role_name } = req.body;
    let role_slug = slugs(role_name);
    let response = await RoleModel.update(
      {
        role_name,
        role_slug,
      },
      {
        where: {
          id: roleId,
        },
      }
    );

    return res.status(200).json({
      status: 200,
      message: response === 1 ? "Updated Successfully" : "Upto date",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server Response : ${error}`,
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    let { roleId } = req.query;

    let response = RoleModel.destroy({
      where: {
        id: roleId,
      },
    });

    return res.status(200).json({
      status: 200,
      message: response === 1 ? "Item removed Successfully" : "Item not found",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server Response : ${error}`,
    });
  }
};

export default { fetchRoles, createRole, updateRole, deleteRole };
