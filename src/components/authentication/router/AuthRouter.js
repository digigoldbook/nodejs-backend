import express from "express";
import multer from "multer";

import SignInController from "../controller/SignInController.js";
import SignUpController from "../controller/SignUpController.js";
import AuthController from "../controller/AuthController.js";
import {
  verifyActivationCode,
  resendActivationCode,
} from "../controller/AccountVerification.js";
import ipMiddleware from "../helper/IPHelper.js";

const aRoute = express.Router();
const upload = multer();

aRoute.use(ipMiddleware);

aRoute
  .post("/sign-in", upload.none(), SignInController.signInUser)
  .post("/sign-up", upload.none(), SignUpController.signUpUser)
  .post("/verify-account", upload.none(), verifyActivationCode)
  .post("/resend-otp", upload.none(), resendActivationCode)
  .post("/verify-token", upload.none(), AuthController.generateToken);

export default aRoute;
