import jwt from "jsonwebtoken";

import UserModel from "../../users/model/UserModel.js";

const generateToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token is required" });
  }

  let user = await UserModel.findOne({ where: { session_key: refreshToken } });

  if (!user) {
    return res.status(403).json({ message: "Invalid refresh token" });
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
