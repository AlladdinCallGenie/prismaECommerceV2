import { Request, Response, NextFunction } from "express";
import prisma from "../Config/config";

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: {
        cartItem: {
          select: {
            id: true,
            cartId: true,
            quantity: true,
            price: true,
            sku: {
              select: {
                id: true,
                productId: true,
                attributes: true,
                skuCode: true,
                productPrice: true,
                discount: true,
                stock: false,
                image: true,
              },
            },
          },
        },
      },
    });

    if (cart === null) throw new Error("User Cart is Empty ..... ");
    return res.status(200).json({ message: "LoggedIn user cart:- ", cart });
  } catch (error) {
    next(error);
  }
};
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new Error("not LoggedIn..");

    const { skuId, quantity } = req.body;
    const userId = req.user.id;

    let cart = await prisma.cart.findUnique({ where: { userId: userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: userId } });
    }

    const sku = await prisma.sku.findUnique({
      where: { id: skuId },
    });
    if (!sku || !sku.isActive || sku.isDeleted)
      throw new Error("Sku not available..");

    const existingItem = await prisma.cartItems.findFirst({
      where: { cartId: cart.id, sku: { id: skuId } },
    });
    if (existingItem) {
      const updatedItem = await prisma.cartItems.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          price: (existingItem.quantity + quantity) * sku.productPrice,
        },
      });

      return res.status(200).json({ updatedItem });
    } else {
      const newItem = await prisma.cartItems.create({
        data: {
          cartId: cart.id,
          skuId: skuId,
          quantity,
          price: sku.productPrice * quantity,
        },
      });
      // const newItemData =
      return res.status(200).json({ newItem });
    }
  } catch (error) {
    next(error);
  }
};
export const removeFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cartItemId } = req.params;
    await prisma.cartItems.delete({ where: { id: parseInt(cartItemId) } });
    return res.status(200).json({ message: "Cart Item deleted successfully" });
  } catch (error) {
    next(error);
  }
};
export const dropCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error("User does not have any cart ");
    await prisma.cart.delete({
      where: { userId: userId },
    });
    return res.status(200).json({ message: "Cart deleted successfully " });
  } catch (error) {
    next(error);
  }
};
export const updateCartItemQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cartItemId, quantity } = req.body;
    const item = await prisma.cartItems.findUnique({
      where: { id: cartItemId },
    });
    if (!item) throw new Error("No item in cart with ID");
    if (quantity <= 0) {
      await prisma.cartItems.delete({
        where: { id: cartItemId },
      });
      return res
        .status(200)
        .json({ message: "Cart Item removed successfully " });
    }

    const sku = await prisma.sku.findUnique({
      where: { id: item.skuId },
    });
    if (!sku) throw new Error("No Product Found");
    const updated = await prisma.cartItems.update({
      where: { id: cartItemId },
      data: { quantity, price: sku.productPrice * quantity },
    });
    return res.status(200).json({ updated });
  } catch (error) {
    next(error);
  }
};
