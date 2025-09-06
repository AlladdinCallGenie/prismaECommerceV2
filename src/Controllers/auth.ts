import { Request, Response, NextFunction } from "express";
import prisma from "../Config/config";
import {
  compareHash,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  generateOtp,
  transporter,
} from "../Utils/utilities";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, username, firstName, lastName, password, role } = req.body;
    const isUser = await prisma.user.findUnique({ where: { email: email } });
    if (isUser) return res.status(400).json({ error: "User already exists" });
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        firstName,
        lastName,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({ message: "User created successfully...." });
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
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid Credentials...");
    if (user.isDeleted) throw new Error("Cant Login");
    if (!user.isActive) throw new Error("This Account is deactivated");

    const isPasswordValid = await compareHash(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid Credentials...");

    const accessToken = generateAccessToken({ email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        lastLogin: new Date(),
      },
    });

    const loggedInUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    return res
      .status(200)
      .json({ message: "LoggedIn successfull", loggedInUser });
  } catch (error) {
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
    if (newPassword != confirmPassword)
      throw new Error("password and confirmPassword does not match");
    const isOldPasswordValid = await compareHash(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await hashPassword(newPassword);
    const accessToken = generateAccessToken({ email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
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
    console.log("hello there forget password");
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user)
      return res.status(400).json({ message: "Please Register First..." });

    const otp = generateOtp();
    const otpExp = new Date(Date.now() + 2 * 60 * 1000).toString(); // 5min

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        otp: otp,
        otpExpiry: otpExp,
      },
    });
    //send email
    await transporter.sendMail({
      from: "mueed072003@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp} and is valid for 5 minutes!!`,
    });

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
    if (password != confirmPassword)
      throw new Error("password and confirmPassword does not match");
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) return res.status(404).json({ message: "Invalid Email..... " });

    const date = new Date(Date.now()).toString();
    if (date > user.otpExpiry! || otp !== user.otp) {
      throw new Error("Invalid OTP ...");
    }

    const hashedPassword = await hashPassword(password);
    const accessToken = generateAccessToken({ email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        accessToken: accessToken,
        refreshToken: refreshToken,
        otp: null,
        otpExpiry: null,
      },
    });
    return res.status(200).json({ message: "Password reset successfully..." });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
