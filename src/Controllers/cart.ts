import { Request, Response } from "express";
import prisma from "../Config/config";

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        cartItem: {
          include: {
            product: true,
          },
        },
      },
    });
    if (cart === null)
      return res.status(200).json({ message: "User Cart is Empty ..... " });
    return res.status(200).json({ message: "LoggedIn user cart:- ", cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};
// export const addToCart = async (req: Request, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ error: "Not logged in" });

//     const { productId, quantity } = req.body;
//     const userId = req.user.id;

//     let cart = await prisma.cart.findUnique({ where: { userId: userId } });
//     if (!cart) {
//       cart = await prisma.cart.create({ data: { userId: userId } });
//     }

//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//     });
//     if (!product) return res.status(404).json({ error: "Product not found" });

//     const existingItem = await prisma.cartItems.findFirst({
//       where: { cartId: cart.id, productId: productId },
//     });
//     if (existingItem) {
//       const updatedItem = await prisma.cartItems.update({
//         where: { id: existingItem.id },
//         data: {
//           quantity: existingItem.quantity + quantity,
//           price: (existingItem.quantity + quantity) * product.productPrice,
//         },
//       });
//       return res.status(200).json({ updatedItem });
//     } else {
//       const newItem = await prisma.cartItems.create({
//         data: {
//           cartId: cart.id,
//           productId: productId,
//           quantity,
//           price: product.productPrice * quantity,
//         },
//       });
//       return res.status(200).json({ newItem });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: "Failed to add Product to cart..." });
//   }
// };
// export const removeFromCart = async (req: Request, res: Response) => {
//   try {
//     const { cartItemId } = req.params;
//     await prisma.cartItems.delete({ where: { id: parseInt(cartItemId) } });
//     return res.status(200).json({ message: "Cart Item deleted successfully" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Failed to delete Item from cart " });
//   }
// };
// export const dropCart = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     const cart = await prisma.cart.findUnique({ where: { userId } });
//     if (!cart)
//       return res.status(404).json({ message: "User does not have any cart " });
//     await prisma.cart.delete({
//       where: { id: cart.id },
//     });
//     return res.status(200).json({ message: "Cart deleted successfully " });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete Cart " });
//   }
// };
// export const updateCartItemQuantity = async (req: Request, res: Response) => {
//   try {
//     const { cartItemId, quantity } = req.body;
//     if (quantity <= 0) {
//       await prisma.cartItems.delete({
//         where: { id: cartItemId },
//       });
//       return res
//         .status(200)
//         .json({ message: "Cart Item removed successfully " });
//     }
//     const item = await prisma.cartItems.findUnique({
//       where: { id: cartItemId },
//     });
//     const product = await prisma.product.findUnique({
//       where: { id: item?.productId },
//     });
//     if (!product) return res.status(404).json({ message: "No product found " });
//     const updated = await prisma.cartItems.update({
//       where: { id: cartItemId },
//       data: { quantity, price: product.productPrice * quantity },
//     });
//     return res.status(200).json({ updated });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update Quantity of Item" });
//   }
// };
