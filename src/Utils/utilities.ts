import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const hashPassword = async (password: string) => {
  const hash = bcrypt.hash(password, 10);
  return hash;
};

export const compareHash = async (password: string, hash: string) => {
  const isValidPassword = bcrypt.compare(password, hash);
  return isValidPassword;
};

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "10h",
  });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
