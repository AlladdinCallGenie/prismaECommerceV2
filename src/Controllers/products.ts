import { NextFunction, Request, Response } from "express";
import prisma from "../Config/config";

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      select: {
        id: true,
        productName: true,
        categoryId: true,
        description: true,
        brand: true,
        sku: {
          select: {
            id: true,
            productId: true,
            attributes: true,
            skuCode: true,
            productPrice: true,
            discount: true,
            image: true,
          },
        },
      },
      where: { isActive: true },
      orderBy: { id: "asc" },
      skip,
      take: limit,
    });

    const total = await prisma.product.count();

    if (total <= 0)
      return res.status(404).json({ message: "No products Found..." });

    return res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      products,
    });
  } catch (error) {
    next(error);
  }
};
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      select: {
        id: true,
        productName: true,
        categoryId: true,
        description: true,
        brand: true,
        sku: {
          select: {
            id: true,
            productId: true,
            attributes: true,
            skuCode: true,
            productPrice: true,
            discount: true,
            image: true,
          },
        },
      },
      where: { id: parseInt(id) },
    });
    if (!product) throw new Error("No product found with ID");
    return res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};
export const getByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Category name is required" });
    }

    const products = await prisma.product.findMany({
      select: {
        id: true,
        productName: true,
        categoryId: true,
        description: true,
        brand: true,
        sku: {
          select: {
            id: true,
            productId: true,
            attributes: true,
            skuCode: true,
            productPrice: true,
            discount: true,
            image: true,
          },
        },
      },
      where: { category: { name: name, isActive: true } },
      skip,
      take: limit,
    });
    const total = await prisma.product.count({
      where: { category: { name: name, isActive: true } },
    });

    if (total <= 0) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      products,
    });
  } catch (error) {
    next(error);
  }
};
export const skuById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const sku = await prisma.sku.findUnique({
      select: {
        id: true,
        productId: true,
        attributes: true,
        skuCode: true,
        productPrice: true,
        discount: true,
        image: true,
      },
      where: { id: parseInt(id) },
    });
    if (!sku) throw new Error("No SKU found with ID");
    return res.status(200).json({ sku });
  } catch (error) {
    next(error);
  }
};
