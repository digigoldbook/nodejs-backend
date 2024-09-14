import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from "uuid";
import Joi from "joi";

import UserMetaModel from "../../users/model/UserMetaModel.js";
import UserModel from "../../users/model/UserModel.js";
import PasswordHelper from "../helper/PasswordHelper.js";

const signInUser = async (req, res) => {
    try {
      const clientIp = req.clientIp;
      const geo = req.geo;
  
      // ----- Create schema for JOI i.e data validation
      let signInSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      });
  
      const { error, value } = signInSchema.validate(req.body);
  
      // ----- Display error on the basis of schema
      if (error) {
        return res.status(400).json({
          status: 400,
          message: error.details[0].message,
        });
      }
  
      let { email, password } = value;
  
      // ----- Search user on the basis of email
      let user = await UserModel.findOne({
        where: {
          email,
        },
        include: [
          {
            model: UserMetaModel,
            as: "meta",
          },
        ],
      });
  
      // ----- Check if the user of email exists or not
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
  
        // -- Generate token for user
        let accessToken = jwt.sign(
          {
            userId: user.id,
            fullname: user.fullname,
            email: user.email,
            role,
            clientIp,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "30m",
          }
        );
  
        let refreshToken = uuidv4();
  
        return res.status(200).json({
          status: 200,
          accessToken,
          refreshToken,
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
  
  export default {signInUser};