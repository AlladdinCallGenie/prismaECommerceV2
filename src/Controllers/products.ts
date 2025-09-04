import { Request, Response } from "express";
import prisma from "../Config/config";
import { string } from "zod";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch all products..." });
  }
};
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch product..." });
  }
};
export const getByCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Category name is required" });
    }

    const products = await prisma.product.findMany({
      where: { category: { name: name } },
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
