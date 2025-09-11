import { NextFunction, Request, Response } from "express";
import prisma from "../Config/config";

export const placeOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Login ...." });
    const userId = req.user.id;
    const { addressId, couponCode } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { cartItem: true },
    });
    if (!cart || cart.cartItem.length === 0)
      return res.status(400).json({ message: "Cart is Empty.." });

    const address = await prisma.userAddress.findFirst({
      where: { id: addressId, userId },
    });
    if (!address || !address.isShippingAddress)
      throw new Error("Invalid or Not shipping address");

    const totalAmount = cart.cartItem.reduce(
      (sum, item) => sum + item.price,
      0
    );
    let finalAmount = totalAmount;
    let discountAmount = 0;
    let couponId: number | null = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: { code: couponCode },
      });

      if (!coupon || coupon.isActive == false) {
        return res
          .status(400)
          .json({ error: "Invalid or Inactive coupon code " });
      }

      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validTo) {
        return res
          .status(400)
          .json({ message: "Coupon expired or not yet valid" });
      }

      if (coupon.minOrderValue && totalAmount < coupon.minOrderValue) {
        return res
          .status(400)
          .json({ error: "Order does not meet coupon requirement " });
      }

      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = (totalAmount * coupon.discountValue) / 100;
      } else if (coupon.discountType === "FIXED") {
        discountAmount = coupon.discountValue;
      }
      if (discountAmount > totalAmount) {
        return res
          .status(400)
          .json({ error: "Discount cannot exceed final amount" });
      }
      finalAmount = totalAmount - discountAmount;
      couponId = coupon.id;
    }

    const order = await prisma.order.create({
      data: {
        userId: userId,
        shippingAddressId: address.id,
        couponId: couponId,
        totalAmount: totalAmount,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
        orderItems: {
          create: cart.cartItem.map((item) => ({
            skuId: item.skuId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { orderItems: true, coupon: true },
    });

    await prisma.cartItems.deleteMany({ where: { cartId: cart.id } });
    return res
      .status(201)
      .json({ message: "Order placed successfully ", order });
  } catch (error) {
    next(error);
  }
};
export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(404).json({ message: "Login First" });
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });
    if (!order) return res.status(404).json({ message: "Order not found... " });
    const updateOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: "CANCELLED" },
    });
    res.status(200).json({
      message: "Order cancelled",
      order: updateOrder,
    });
  } catch (error) {
    next(error);
  }
};
export const orderHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Login" });
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const userId = req.user.id;
    const history = await prisma.order.findMany({
      where: { userId: userId },
      include: {
        orderItems: true,
        address: true,
      },
      skip,
      take: limit,
      orderBy: { orderDate: "desc" },
    });
    const total = await prisma.order.count({ where: { userId: req.user.id } });

    if (total <= 0)
      return res.status(404).json({ message: "No history found " });

    return res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      history,
    });
  } catch (error) {
    next(error);
  }
};
export const checkStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new Error("Not LoggedIn..");
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });
    if (!order) return res.status(404).json({ message: "No Order found " });
    const status = `${order.status} ON ${order.orderDate}`;
    return res.status(200).json({ message: status });
  } catch (error) {
    next(error);
  }
};

// Imcomplete controller to repeat the order
export const repeateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Login ..." });
    const userId = req.user.id;
    const { orderId } = req.params;
    const { addressId, couponCode } = req.body;
    const originalOrder = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { orderItems: true },
    });
    if (!originalOrder) throw new Error("originalOrder Not Found");
    const address = await prisma.userAddress.findFirst({
      where: { id: addressId, userId, isShippingAddress: true },
    });
    if (!address) throw new Error("Invalid or non-shipping address");

    for (const item of originalOrder.orderItems) {
      const sku = await prisma.sku.findUnique({
        where: { id: item.skuId, isDeleted: false, isActive: true },
      });
      if (!sku) throw new Error(`product ${item.skuId} not available`);
    }
    let finalAmount = originalOrder.totalAmount;
    let couponId = null;
    let discountAmount = 0;

    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: { code: couponCode },
      });
      if (!coupon || coupon.isActive === false)
        throw new Error("Invalid or Inactive coupon code ");

      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validTo)
        throw new Error("Coupon expired or not yet valid");

      if (
        coupon.minOrderValue &&
        originalOrder.totalAmount < coupon.minOrderValue
      )
        throw new Error("Order does not meet coupon requirements..");
      if (coupon.discountType === "PERCENTAGE") {
        discountAmount =
          (originalOrder.totalAmount * coupon.discountValue) / 100;
      } else if (coupon.discountType === "FIXED") {
        discountAmount = coupon.discountValue;
      }
      if (discountAmount > originalOrder.totalAmount)
        throw new Error("Discount amount cannot exceed final amount ");
      finalAmount = originalOrder.totalAmount - discountAmount;
      couponId = coupon.id;
    }

    const newOrder = await prisma.order.create({
      data: {
        userId,
        shippingAddressId: address.id,
        couponId: couponId,
        totalAmount: originalOrder.totalAmount,
        discountAmount,
        finalAmount,
        orderItems: {
          create: originalOrder.orderItems.map((item) => ({
            skuId: item.skuId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { orderItems: true },
    });

    for (const item of originalOrder.orderItems) {
      await prisma.sku.update({
        where: { id: item.skuId },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    }

    return res
      .status(200)
      .json({ message: "Order repeated successfully..", newOrder: newOrder });
    return res.json({ originalOrder });
  } catch (error) {
    next(error);
  }
};
