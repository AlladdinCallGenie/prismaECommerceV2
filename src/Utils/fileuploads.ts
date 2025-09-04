import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const uploadOnCloudinary = async (path: string) => {
  try {
    if (!path) return "No path provided";
    // upload the file on cloudinary
    const result = await cloudinary.uploader.upload(path, {
      resource_type: "auto",
    });
    console.log("File uploded on cloudinary..", result.url);
    return result;
  } catch (error) {
    fs.unlinkSync(path);
    return error
  }
};



