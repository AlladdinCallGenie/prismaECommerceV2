import { Request, Response, NextFunction } from "express";
import prisma from "../Config/config";

import {
  hashPassword,
  compareHash,
  generateAccessToken,
  generateRefreshToken,
} from "../Utils/utilities";
import { error } from "console";

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

    const isPasswordValid = await compareHash(password, user.password);

    if (!isPasswordValid) throw new Error("Invalid Credentials...");

    const accessToken = generateAccessToken({ email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id });

    await prisma.user.update({
      where: { id: user.id },
      data: { accessToken: accessToken, refreshToken: refreshToken },
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
