import { Request, Response, NextFunction } from "express";
import prisma from "../Config/config";
import { hashPassword } from "../Utils/utilities";

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
    const total = await prisma.userAddress.count();
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
    const { email, password, username, firstName, lastName, role } = req.body;
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user)
      return res.status(404).json({ message: "User does not exists.. " });
    const hashedPassword = await hashPassword(password);
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        email,
        username,
        firstName,
        lastName,
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
export const deactivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user)
      return res.status(404).json({ message: "User not found with given Id" });
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        isActive: false,
      },
    });
    return res.status(200).json({ message: "user Deactivated successfully.." });
  } catch (error) {
    next(error);
  }
};
export const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user)
      return res.status(404).json({ message: "User not found with given Id" });
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        isActive: true,
      },
    });
    return res.status(200).json({ message: "user Deactivated successfully.." });
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
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const category = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!category)
      return res.status(404).json({ error: "No category found ..." });
    await prisma.category.delete({ where: { id: Number(id) } });
    return res
      .status(200)
      .json({ message: "Category deleted successfully..." });
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

type SkuInput = {
  description: string;
  attributes: Record<string, any>;
  skuCode: string;
  productPrice: number;
  discount?: number;
  stock: number;
  image: string;
};
type createProduct = {
  categoryId: string;
  productName: string;
  skus: SkuInput[];
};

// ADMIN PRODUCT
export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId, productName, skus } = req.body as createProduct;
    if (!productName || !categoryId || !Array.isArray(skus)) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // const uploadedFile = req.file;
    // if (!uploadedFile) throw new Error("No file uploaded");

    const isProduct = await prisma.product.findUnique({
      where: { productName: productName },
    });
    if (isProduct) throw new Error("Duplicate products not allowed");

    let imageUrl: string | null = null;
    // if (req.file) {
    //   imageUrl = `/public/temp${Date.now()}-${req.file.originalname}`;
    //   console.log(req.file);
    //   console.log(req.body);
    // }

    const product = await prisma.product.create({
      data: {
        categoryId: parseInt(categoryId),
        productName,
        sku: {
          create: skus.map((sku) => ({
            description: sku.description,
            attributes: sku.attributes,
            skuCode: sku.skuCode,
            productPrice: sku.productPrice,
            discount: sku.discount,
            stock: sku.stock,
            image: imageUrl ?? "",
          })),
        },
      },
      include: { sku: true },
    });
    return res
      .status(200)
      .json({ message: "Product added successfully .. ", product });
  } catch (error) {
    console.log(error);
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
    const { categoryId, productName } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product)
      return res.status(404).json({ message: "product not found with ID" });

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { categoryId: parseInt(categoryId), productName },
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
      },
    });
    return res.status(200).json({ message: "product deleted successfully..." });
  } catch (error) {
    next(error);
  }
};
export const deActiveProduct = async (
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
        isActive: false,
      },
    });
    return res.status(200).json({ message: "product diabled successfully..." });
  } catch (error) {
    next(error);
  }
};
export const activateProduct = async (
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
        isActive: true,
      },
    });
    return res
      .status(200)
      .json({ message: "product activated successfully..." });
  } catch (error) {
    next(error);
  }
};
export const allProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      select: { id: true, productName: true, categoryId: true, sku: true },
      orderBy: { id: "asc" },
      skip,
      take: limit,
    });

    const total = await prisma.product.count();
    if (total <= 0)
      return res.status(404).json({ message: "No categories Found.." });

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
export const addSku = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { description, attributes, skuCode, productPrice, discount, stock } =
      req.body;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });
    if (!product) throw new Error("No product found for the sku!");
    const isSkuAvailable = await prisma.sku.findFirst({
      where: { skuCode: skuCode, productId: parseInt(productId) },
    });
    if (isSkuAvailable) throw new Error("SKU code already present");

    let imageUrl: string | null = null;

    const newSku = await prisma.sku.create({
      data: {
        productId: parseInt(productId),
        description,
        attributes,
        skuCode,
        productPrice,
        discount,
        stock,
        image: imageUrl || "",
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
    const { description, attributes, skuCode, productPrice, discount, stock } =
      req.body;

    const sku = await prisma.sku.findUnique({
      where: { id: parseInt(id) },
    });
    if (!sku)
      return res.status(404).json({ message: "product not found with ID" });

    const updatedSku = await prisma.sku.update({
      where: { id: parseInt(id) },
      data: {
        description: description,
        attributes: attributes,
        skuCode: skuCode,
        productPrice: productPrice,
        discount: discount,
        stock: stock,
      },
    });

    return res
      .status(200)
      .json({ message: "Sku updated successfully..", updatedSku });
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
    const sku = await prisma.sku.findUnique({ where: { id: parseInt(id) } });
    if (!sku) throw new Error("No SKU found with ID");
    return res.status(200).json({ sku });
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
        validTo,
      },
    });
    return res.status(201).json({ message: "Coupon created successfully.." });
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
        validTo,
      },
    });
    return res
      .status(200)
      .json({ message: "Updated Coupon:- ", updatedCoupon });
  } catch (error) {
    next(error);
  }
};
export const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const coupon = await prisma.coupon.findUnique({
      where: { id: parseInt(id) },
    });
    if (!coupon) return res.status(404).json({ message: "No coupon found! " });
    await prisma.coupon.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });
    return res.status(200).json({ mesasge: "coupon deleted successfully.." });
  } catch (error) {
    next(error);
  }
};
export const activateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const coupon = await prisma.coupon.findUnique({
      where: { id: parseInt(id) },
    });
    if (!coupon)
      return res.status(400).json({ message: "coupon does not exist " });
    const updatedCoupon = await prisma.coupon.update({
      where: { id: parseInt(id) },
      data: {
        isActive: true,
      },
    });
    return res.status(200).json({
      message: "Coupon activated successfully",
    });
  } catch (error) {
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
      select: { code: true, description: true, isActive: true },
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
      totalItems: total,
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
      return res.status(400).json({ message: "Invalid status provided" });
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });
    if (!order)
      return res.status(404).json({ message: "Orders not found with ID!" });
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
