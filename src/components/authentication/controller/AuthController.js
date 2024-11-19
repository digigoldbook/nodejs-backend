import jwt from "jsonwebtoken";

import UserDeviceModel from "../../users/model/UserDeviceModel.js";
import UserModel from "../../users/model/UserModel.js";

const generateToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token is required" });
  }

  // Find the user device associated with the provided refresh token
  let userDevice = await UserDeviceModel.findOne({
    where: { refresh_token: refreshToken },
  });

  if (!userDevice) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  // Fetch the associated user information
  let user = await UserModel.findOne({
    where: { id: userDevice.user_id },
  });

  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }


  let newAccessToken = jwt.sign(
    {
      userId: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );

  return res.status(200).json({
    accessToken: newAccessToken,
  });
};

export default { generateToken };
