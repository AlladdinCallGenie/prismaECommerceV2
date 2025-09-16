import { Request, Response, NextFunction } from "express";
import prisma from "../Config/config";

export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      select: {
        wishListItems: {
          select: {
            id: true,
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
        },
      },
    });
    if (wishlist?.wishListItems.length === 0)
      res.status(200).json({ message: "Your Wishlist is Empty " });
    return res.status(200).json({ message: "Your Wishlist: ", wishlist });
  } catch (error) {
    next(error);
  }
};
export const addToWishList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new Error("not loggedIn");
    const { skuId } = req.body;
    const userId = req.user?.id;

    let wishlist = await prisma.wishlist.findUnique({
      where: {
        userId,
      },
    });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          userId: userId,
        },
      });
    }

    const sku = await prisma.sku.findUnique({
      where: { id: skuId },
    });
    if (!sku || sku.isDeleted) throw new Error("Sku not available..");

    const existingItem = await prisma.wishlistItem.findFirst({
      where: { skuId, wishListId: wishlist.id },
    });
    if (existingItem) throw new Error("Item already in wishlist...");

    const item = await prisma.wishlistItem.create({
      data: {
        wishListId: wishlist.id,
        skuId,
      },
      select: {
        wishListId: true,
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
    });

    return res.status(200).json({ message: "Item added to wishlist..", item });
  } catch (error) {
    next(error);
  }
};
export const removeWishlistItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params; // wishlistItem id
    const item = await prisma.wishlistItem.findUnique({
      where: { id: Number(id) },
    });
    if (!item) throw new Error("No item with give ID..");
    await prisma.wishlistItem.delete({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json({ message: "item deleted successfully..." });
  } catch (error) {
    next(error);
  }
};
export const addItemToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new Error("not LoggedIn..");
    const { skuId, wishListId } = req.body;
    const userId = req.user.id;

    const inWishlist = await prisma.wishlistItem.findFirst({
      where: {
        skuId,
        wishListId,
      },
    });
    if (!inWishlist) throw new Error("Product not in wishlist..");
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
    if (existingItem) throw new Error("Item already in cart..");

    const newItem = await prisma.cartItems.create({
      data: {
        cartId: cart.id,
        skuId,
        quantity: 1,
        price: sku.productPrice,
      },
    });
    return res.status(200).json({ message: "Item added to cart ", newItem });
  } catch (error) {
    next(error);
  }
};
