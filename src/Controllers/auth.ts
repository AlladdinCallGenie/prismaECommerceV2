import { Request, Response } from "express";
import prisma from "../Config/config";

import {
  hashPassword,
  compareHash,
  generateAccessToken,
  generateRefreshToken,
} from "../Utils/utilities";

export const register = async (req: Request, res: Response) => {
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
    console.log(error);
    res.status(500).json({ error: "Failed to register User " });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials..." });
    const isPasswordValid = await compareHash(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ error: "Invalid credentials..." });

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
    console.log(error);
    res.status(500).json({ error: "Login Failed ..." });
  }
};
