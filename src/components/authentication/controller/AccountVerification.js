import UserModel from "../../users/model/UserModel.js";
import sendRegistrationEmail from "../helper/EmailHelper.js";

export const verifyActivationCode = async (req, res) => {
  const { email, code } = req.body;

  const user = await UserModel.findOne({
    where: { email, activation_code: code },
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.is_verified === 1) {
    return res.status(400).json({ message: "Account already activated" });
  }

  if (new Date() > user.token_expires_at) {
    return res.status(400).json({ message: "Activation token has expired." });
  }

  user.is_verified = 1;
  user.activation_code = null;
  user.token_expires_at = null;
  await user.save();

  return res.status(200).json({ message: "Account successfully activated!" });
};

export const resendActivationCode = async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.is_verified === 1) {
    return res.status(400).json({ message: "Account already verified" });
  }

  const newCode = Math.floor(100000 + Math.random() * 900000).toString();
  const newExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min from now

  user.activation_code = newCode;
  user.token_expires_at = newExpiry;
  await user.save();

  sendRegistrationEmail(email, newCode);

  return res.status(200).json({ message: "New activation code sent to your email." });
};

