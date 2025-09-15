import { Request, Response, NextFunction } from "express";
import prisma from "../Config/config";
import { hashPassword } from "../Utils/utilities";
import { file } from "zod";

// ADMIN USERS
export const allUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      skip,
      take: limit,
    });
    const total = await prisma.user.count();
    if (total <= 0) return res.status(404).json({ message: "No Users Found " });
    return res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalitems: total,
      users,
    });
  } catch (error) {
    next(error);
  }
};
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user)
      return res.status(404).json({ message: "User does not exists.." });
    return res.status(200).json({ user: user });
  } catch (error) {
    next(error);
  }
};
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { email, password, username, fullName, phone, role } = req.body;
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user)
      return res.status(404).json({ message: "User does not exists.. " });
    const hashedPassword = await hashPassword(password);
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        email,
        username,
        fullName,
        phone,
        password: hashedPassword,
        role,
      },
    });
    return res.status(200).json({ message: "Updated User:- ", updatedUser });
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user)
      return res.status(404).json({ message: "User does not exists.. " });
    await prisma.user.update({
      where: { id: Number(id) },
      data: { isDeleted: true },
    });
    return res.status(200).json({ message: "User deleted successfully .. " });
  } catch (error) {
    next(error);
  }
};
export const changeUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user)
      return res.status(404).json({ message: "User not found with given Id" });
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        isActive: JSON.parse(status),
      },
    });
    return res
      .status(200)
      .json({ message: `Changed user status to: ${JSON.parse(status)}` });
  } catch (error) {
    next(error);
  }
};

// ADMIN CATEGORY
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.findUnique({ where: { name } });
    if (category)
      return res.status(400).json({ error: "Category already exists.. " });
    const newCategory = await prisma.category.create({ data: { name: name } });
    return res
      .status(200)
      .json({ message: "Category created successfully....", newCategory });
  } catch (error) {
    next(error);
  }
};
export const changeCategoryStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    if (!category)
      return res.status(404).json({ error: "No category found ..." });
    await prisma.category.update({
      where: { id: parseInt(id) },
      data: { isActive: JSON.parse(status) },
    });
    return res
      .status(200)
      .json({ message: `Changed category status to: ${JSON.parse(status)}` });
  } catch (error) {
    next(error);
  }
};
export const allcategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
      skip,
      take: limit,
    });
    const total = await prisma.category.count();

    if (total <= 0)
      return res.status(404).json({ message: "No categories Found.." });

    return res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      categories,
    });
  } catch (error) {
    next(error);
  }
};
export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!category)
      return res.status(404).json({ message: "No category found with id.." });
    return res.status(200).json({ category });
  } catch (error) {
    next(error);
  }
};
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!category)
      return res.status(404).json({ message: "No category found with id.." });
    await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name: name },
    });
    return res
      .status(200)
      .json({ message: "Category updated successfully..." });
  } catch (error) {
    next(error);
  }
};

// ADMIN PRODUCT
// type SkuInput = {
//   description: string;
//   attributes: Record<string, any>;
//   skuCode: string;
//   productPrice: number;
//   discount?: number;
//   stock: number;
//   image: string;
// };
// type createProduct = {
//   categoryId: string;
//   productName: string;
//   skus: SkuInput[];
// };

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId, productName, description, brand, } = req.body;
    // if (!Array.isArray(skus)) {
    //   return res.status(400).json({ error: "Missing required fields" });
    // }

    const isProduct = await prisma.product.findUnique({
      where: { productName: productName },
    });
    if (isProduct) throw new Error("Duplicate products not allowed");

    const product = await prisma.product.create({
      data: {
        categoryId: parseInt(categoryId),
        productName,
        description,
        brand,
        // sku: {
        //   create: skus.map((sku) => ({
        //     attributes: sku.attributes,
        //     skuCode: sku.skuCode,
        //     productPrice: sku.productPrice,
        //     discount: sku.discount,
        //     stock: sku.stock,
        //     // image: imageUrl ?? "",
        //   })),
        // },
      },
      include: { sku: true },
    });
    return res
      .status(200)
      .json({ message: "Product added successfully .. ", product });
  } catch (error) {
    next(error);
  }
};
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { categoryId, productName, description, brand } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product)
      return res.status(404).json({ message: "product not found with ID" });

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        categoryId: parseInt(categoryId),
        productName,
        description,
        brand,
      },
    });

    return res
      .status(200)
      .json({ message: "product updated successfully..", updatedProduct });
  } catch (error) {
    next(error);
  }
};
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const isproduct = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!isproduct)
      return res.status(404).json({ message: "product not found with ID" });
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        isDeleted: true,
        isDeletedAt: new Date(),
        isActive: false,
      },
    });

    return res.status(200).json({ message: "product deleted successfully..." });
  } catch (error) {
    next(error);
  }
};
export const changeProductStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const isproduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!isproduct) throw new Error("No product found..");
    await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        isActive: JSON.parse(status),
      },
    });
    const skus = await prisma.sku.findMany({
      where: { productId: parseInt(id) },
    });
    if (skus) {
      await prisma.sku.updateMany({
        where: { productId: parseInt(id) },
        data: { isActive: JSON.parse(status) },
      });
    }
    return res
      .status(200)
      .json({ message: "product status changed successfully..." });
  } catch (error) {
    next(error);
  }
};
export const getAllAdminProducts = async (
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

//ADMIN SKU
export const addSku = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { attributes, skuCode, productPrice, discount, stock } = req.body;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });
    if (!product) throw new Error("No product found for the sku!");
    const isSkuAvailable = await prisma.sku.findFirst({
      where: { skuCode: skuCode, productId: parseInt(productId) },
    });
    if (isSkuAvailable) throw new Error("SKU code already present");

    let imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      imageUrls = req.files.map(
        (file: Express.Multer.File) => `/uploads/${file.filename}`
      );
    }
    const newSku = await prisma.sku.create({
      data: {
        productId: parseInt(productId),
        attributes: JSON.parse(attributes),
        skuCode,
        productPrice,
        discount,
        stock,
        image: imageUrls || "",
      },
    });
    return res
      .status(200)
      .json({ message: "SKU created successfully..", newSku });
  } catch (error) {
    next(error);
  }
};
export const updateSku = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { attributes, skuCode, productPrice, discount, stock } = req.body;

    const sku = await prisma.sku.findUnique({
      where: { id: parseInt(id) },
    });
    if (!sku) throw new Error("SKU not found with ID");
    const isSkuCode = await prisma.sku.findUnique({
      where: { skuCode: skuCode },
    });
    if (isSkuCode) throw new Error("SKU CODE already present");

    let imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      imageUrls = req.files.map(
        (file: Express.Multer.File) => `/uploads/${file.filename}`
      );
    }

    const updatedSku = await prisma.sku.update({
      where: { id: parseInt(id) },
      data: {
        attributes: JSON.parse(attributes),
        skuCode,
        productPrice,
        discount,
        stock,
        image: imageUrls || "",
      },
    });

    return res
      .status(200)
      .json({ message: "Sku updated successfully..", updatedSku });
  } catch (error) {
    next(error);
  }
};
export const deleteSku = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const isSku = await prisma.sku.findUnique({
      where: { id: parseInt(id) },
    });
    if (!isSku) throw new Error("sku not found with ID");
    await prisma.sku.update({
      where: { id: parseInt(id) },
      data: {
        isDeleted: true,
        isActive: false,
      },
    });
    return res.status(200).json({ message: "SKU deleted successfully..." });
  } catch (error) {
    next(error);
  }
};
export const changeSkuStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const isSku = await prisma.sku.findUnique({
      where: { id: parseInt(id) },
    });
    if (!isSku) throw new Error("sku not found with ID");
    await prisma.sku.update({
      where: { id: parseInt(id) },
      data: {
        isActive: JSON.parse(status),
      },
    });

    return res
      .status(200)
      .json({ message: `Changed sku status to: ${JSON.parse(status)}` });
  } catch (error) {
    next(error);
  }
};
export const allSkus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const skus = await prisma.sku.findMany({
      select: {
        id: true,
        productId: true,
        attributes: true,
        skuCode: true,
        productPrice: true,
        discount: true,
        stock: true,
        image: true,
      },
      orderBy: { id: "asc" },
      skip,
      take: limit,
    });

    const total = await prisma.sku.count();
    if (total <= 0)
      return res.status(404).json({ message: "No SKU'S Found.." });

    return res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      skus,
    });
  } catch (error) {
    next(error);
  }
};

//ADMIN COUPON
export const addCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      validTo,
    } = req.body;
    const isCode = await prisma.coupon.findFirst({ where: { code } });
    if (isCode)
      return res.status(400).json({ message: "Coupon already exists " });
    const coupon = await prisma.coupon.create({
      data: {
        code,
        description,
        discountType,
        discountValue,
        minOrderValue,
        maxDiscount,
        validTo: new Date(validTo),
      },
    });
    return res
      .status(201)
      .json({ message: "Coupon created successfully: ", coupon });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const updateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      validTo,
    } = req.body;
    const isCoupon = await prisma.coupon.findUnique({
      where: { id: parseInt(id) },
    });
    if (!isCoupon)
      return res.status(400).json({ message: "Coupon does not exists " });
    const updatedCoupon = await prisma.coupon.update({
      where: { id: parseInt(id) },
      data: {
        code,
        description,
        discountType,
        discountValue,
        minOrderValue,
        maxDiscount,
        validTo: new Date(validTo),
      },
    });
    return res
      .status(200)
      .json({ message: "Updated Coupon:- ", updatedCoupon });
  } catch (error) {
    next(error);
  }
};
export const changeCouponStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const coupon = await prisma.coupon.findUnique({
      where: { id: parseInt(id) },
    });
    if (!coupon) return res.status(404).json({ message: "No coupon found! " });
    await prisma.coupon.update({
      where: { id: parseInt(id) },
      data: { isActive: JSON.parse(status) },
    });
    return res
      .status(200)
      .json({ mesasge: `Changed coupon status to: ${JSON.parse(status)}` });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const allCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const allCoupons = await prisma.coupon.findMany({
      // select: { code: true, description: true, isActive: true },
      orderBy: { id: "asc" },
      skip,
      take: limit,
    });
    const total = await prisma.coupon.count();

    if (total <= 0) return res.status(404).json({ message: "No coupons here" });

    return res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      allCoupons,
    });
  } catch (error) {
    next(error);
  }
};

//ADMIN ORDER
export const allOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const orders = await prisma.order.findMany({
      orderBy: { orderDate: "asc" },
      include: { orderItems: true },
      skip,
      take: limit,
    });
    const total = await prisma.order.count();
    if (total <= 0)
      return res.status(404).json({ message: "No Orders tille now!" });

    return res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total,
      orders,
    });
  } catch (error) {
    next(error);
  }
};
export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status))
      throw new Error("Invalid status provided");
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });
    if (!order) throw new Error("Orders not found with ID!");
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: status },
    });
    return res
      .status(200)
      .json({ message: "order marked as " + status, order: updatedOrder });
  } catch (error) {
    next(error);
  }
};

//For testing purpose only
export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });
    if (!order) throw new Error("No order found ");

    // const result = await prisma.cartItems.deleteMany({ where: { cartId: { gte: 0 } } });
    const result = await prisma.order.delete({
      where: { id: parseInt(id) },
    });
    return res
      .status(200)
      .json({ message: "Done Deleting the order ", result });
  } catch (error) {
    next(error);
  }
};
