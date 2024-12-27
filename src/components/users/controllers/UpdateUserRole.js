import UserModel from "../model/UserModel.js";

export const updateUserRole = async (req, res) => {
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
  
      await UserModel.update(
        { role },
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
  