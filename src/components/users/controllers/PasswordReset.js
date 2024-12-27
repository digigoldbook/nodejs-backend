import Joi from "joi";

import UserModel from "../model/UserModel.js";
import PasswordHelper from "../../authentication/helper/PasswordHelper.js";

export const passwordReset = async (req, res) => {
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
  
      let items = await UserModel.findOne({
        where: {
          email,
        }
      });
  
      if(!items){
        return res.status(400).json({
          status: 400,
          message: "User not found",
        })
      }
  
      let { newPassword, confirmPassword } = value;
  
      // check the password entered by user matched or not!
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          status: 400,
          message: "Password did not matched",
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