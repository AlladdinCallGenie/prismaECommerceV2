import { Request, Response,NextFunction } from "express";
import prisma from "../Config/config";
import { hashPassword } from "../Utils/utilities";

// ADMIN USERS
export const allUsers = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const users = await prisma.user.findMany({});
    if (!users || users.length === 0)
      return res.status(404).json({ message: "No Users Found " });
    return res.status(200).json({ "Users:- ": users });
  } catch (error) {
    next(error)
  }
};
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user)
      return res.status(404).json({ message: "User does not exists.." });
    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(500).json({ error: "Failed to find User with ID .." });
  }
};
export const updateUser = async (req: Request, res: Response) => {
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
    return res.status(500).json({ error: "Failed to update User .." });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
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
    return res.status(500).json({ error: "Cannot delete user" });
  }
};
// ADMIN CATEGORY
export const createCategory = async (req: Request, res: Response) => {
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
    return res.status(500).json({ error: "Failed to create Category .." });
  }
};
export const deleteCategory = async (req: Request, res: Response) => {
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
    return res.status(500).json({ error: "cant delete category..." });
  }
};
export const allcategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });

    if (!categories || categories.length === 0)
      return res.status(404).json({ message: "No categories Found.." });

    return res.status(200).json({ Categories: categories });
  } catch (error) {
    return res.status(500).json({ error: "cant show categories..." });
  }
};
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!category)
      return res.status(404).json({ message: "No category found with id.." });
    return res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ error: "Failed to get the Category by ID..." });
  }
};

// ADMIN PRODUCT
export const addProduct = async (req: Request, res: Response) => {
  try {
    const {
      categoryId,
      productName,
      productPrice,
      description,
      stock,
      discount,
    } = req.body;

    const isProduct = await prisma.product.findUnique({
      where: { productName: productName },
    }); //, validate(ProductSchema)
    if (isProduct)
      return res
        .status(400)
        .json({ message: "Duplicate products not allowed .." });
    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = `/public/temp${Date.now()}-${req.file.originalname}`;
      console.log(req.file);
      console.log(req.body);
    }
    const product = await prisma.product.create({
      data: {
        categoryId: parseInt(categoryId),
        productName,
        productPrice: parseFloat(productPrice),
        description,
        stock: parseInt(stock),
        discount: parseFloat(discount),
        image: imageUrl || "",
      },
    });
    return res.status(200).json({ message: "Product added successfully .. " });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "cant add product.. " });
  }
};
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      categoryId,
      productName,
      productPrice,
      description,
      stock,
      discount,
      image,
    } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product)
      return res.status(404).json({ message: "product not found with ID" });
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        categoryId,
        productName,
        productPrice,
        description,
        stock,
        discount,
        image,
      },
    });
    return res
      .status(200)
      .json({ message: "product updated successfully..", updatedProduct });
  } catch (error) {}
};
export const deleteProduct = async (req: Request, res: Response) => {
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
    return res.status(500).json({ error: "cannot delete product.." });
  }
};
export const deActiveProduct = async (req: Request, res: Response) => {
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
    return res.status(500).json({ error: "cannot delete product.." });
  }
};
export const activateProduct = async (req: Request, res: Response) => {
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
    return res.status(500).json({ error: "cannot delete product.." });
  }
};
export const allProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({});
    if (!products || products.length === 0)
      return res.status(404).json({ message: "No products ..." });
    return res.status(200).json({ message: "Products:- ", products });
  } catch (error) {
    return res.status(500).json({ error: "cant find products.." });
  }
};

//ADMIN COUPON
export const addCoupon = async (req: Request, res: Response) => {
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
    return res.status(500).json({ error: "Cant add Coupon for somw reason.." });
  }
};
export const updateCoupon = async (req: Request, res: Response) => {
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
    return res
      .status(500)
      .json({ message: "Cannot update coupon due to some reason.." });
  }
};
export const deleteCoupon = async (req: Request, res: Response) => {
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
    return res.status(500).json({ error: "Cant delete coupon .." });
  }
};
export const activateCoupon = async (req: Request, res: Response) => {
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
    return res.status(500).json({ message: "Cannot activate coupon" });
  }
};
export const allCoupon = async (req: Request, res: Response) => {
  try {
    const allCoupons = await prisma.coupon.findMany();
    if (!allCoupons || allCoupons.length === 0)
      return res.status(404).json({ message: "No coupons here" });
  } catch (error) {
    return res.status(500).json({ error: "Cant show all coupons now." });
  }
};

//ADMIN ORDER
export const allOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { orderDate: "asc" },
      include: { orderItems: true },
    });
    if (!orders || orders.length === 0)
      return res.status(404).json({ message: "No Orders tille now!" });
    return res.status(200).json({ Orders: orders });
  } catch (error) {
    return res.status(500).json({ error: "Cant show all the orders" });
  }
};
export const updateStatus = async (req: Request, res: Response) => {
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
    res.status(500).json({ error: "Failed to update the order" });
  }
};
