import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../Config/config";
import { generateAccessToken, generateRefreshToken } from "../Utils/utilities";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Please Login..." });
  const accessToken = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as JwtPayload;

    const existingUser = await prisma.user.findUnique({
      where: { email: decoded.email },
    });
    if (!existingUser)
      return res.status(401).json({ error: "User Not found.. " });

    req.user = existingUser;
    return next();
  } catch (error) {
    console.log(error);
    refreshAccessToken(res, req, next);
  }
};

async function refreshAccessToken(
  res: Response,
  req: Request,
  next: NextFunction
) {
  try {
    const incomingRefreshToken = req.body.refreshToken;
    if (!incomingRefreshToken)
      return res.status(401).json({ message: "No RefreshToken..." });
    const decoded = jwt.verify(
      incomingRefreshToken,
      REFRESH_TOKEN_SECRET
    ) as JwtPayload;

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res
        .status(403)
        .json({ message: "Invalid or Expired refreshToken" });
    }

    const accessToken = generateAccessToken({ email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id });

    await prisma.user.update({
      where: { id: user.id },
      data: { accessToken: accessToken, refreshToken: refreshToken },
    });
    req.user = user;
    return next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or Expired refresh token" });
  }
}
