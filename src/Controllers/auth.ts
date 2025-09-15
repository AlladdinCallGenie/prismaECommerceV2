import { Request, Response, NextFunction } from "express";
import {
  loginUser,
  registerUser,
  changeUserPassword,
  forgetUserPassword,
  resetUserPassword,
  sendloginOtp,
  verifyEmailOtp,
} from "../Services/auth";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, username, fullName, password, phone } = req.body;

    await registerUser(email, username, fullName, phone, password);

    res.status(201).json({ message: "User registered successfully...." });
  } catch (error) {
    next(error);
  }
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    return res.status(200).json({ message: "LoggedIn successfull", user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Not loggedIn" });

    const cUser = await changeUserPassword(
      user.id,
      oldPassword,
      newPassword,
      confirmPassword
    );

    return res
      .status(200)
      .json({ message: "Password changed successfully..." });
  } catch (error) {
    next(error);
  }
};
export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    forgetUserPassword(email);

    return res
      .status(201)
      .json({ message: `Please verify otp sent to ${email}` });
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { otp, email, password, confirmPassword } = req.body;

    await resetUserPassword(otp, email, password, confirmPassword);

    return res.status(200).json({ message: "Password reset successfully..." });
  } catch (error) {
    next(error);
  }
};

//test
export const sendLoginOtpEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    await sendloginOtp(email);
    return res.status(200).json({ message: "OTP sent to Email.." });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const verifyLoginOtpEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;

    const user = await verifyEmailOtp(email, otp);

    return res.status(200).json({ message: "LoggedIn successfull...", user });
  } catch (error) {
    next(error);
  }
};

//test twilio
export const verifyOtpSms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
  } catch (error) {
    next(error);
  }
};
