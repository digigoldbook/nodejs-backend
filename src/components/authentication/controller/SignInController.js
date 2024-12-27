import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import Joi from "joi";
import UserMetaModel from "../../users/model/UserMetaModel.js";
import UserModel from "../../users/model/UserModel.js";
import UserDeviceModel from "../../users/model/UserDeviceModel.js";
import PasswordHelper from "../helper/PasswordHelper.js";

const signInUser = async (req, res) => {
  try {
    // ----- Create schema for JOI i.e data validation
    let signInSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      clientIp: Joi.string().required(),
      deviceName: Joi.string().required(),
    });

    const { error, value } = signInSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    let { email, password, clientIp, deviceName } = value;

    // ----- Search user on the basis of email
    let user = await UserModel.findOne({
      where: { email },
      include: [{ model: UserMetaModel, as: "meta" }],
    });

    if (user === null) {
      return res.status(404).json({
        status: 404,
        message: `User not found for ${email}`,
      });
    }

    let isPasswordTrue = PasswordHelper.decryptPassword(
      password,
      user.password
    );

    if (isPasswordTrue) {
      let role = user.meta.find(
        (metaItem) => metaItem.meta_key === "role"
      )?.meta_value;

      // Generate a new access token specific to the device
      let accessToken = jwt.sign(
        {
          userId: user.id,
          fullname: user.fullname,
          email: user.email,
          contact: user.contact_no,
          role: user.role,
          clientIp,
          deviceName,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
      );

      // Generate a new refresh token
      let refreshToken = uuidv4();

      // Check if the device is already registered
      let userDevice = await UserDeviceModel.findOne({
        where: {
          user_id: user.id,
          device_name: deviceName,
          ip_address: clientIp,
        },
      });

      if (userDevice) {
        // Update the refresh token for an existing device
        userDevice.refresh_token = refreshToken;
        await userDevice.save();
      } else {
        // Register the new device
        await UserDeviceModel.create({
          user_id: user.id,
          device_name: deviceName,
          ip_address: clientIp,
          refresh_token: refreshToken,
        });
      }

      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      return res.status(200).json({
        status: 200,
        accessToken,
        refreshToken,
        deviceName,
        clientIp,
      });
    }
    return res.status(404).json({
      status: 404,
      message: "Password did not match",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: `Internal Server error ${error}`,
    });
  }
};

export default { signInUser };
