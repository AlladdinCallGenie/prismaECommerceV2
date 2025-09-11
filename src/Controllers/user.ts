import { NextFunction, Request, Response } from "express";
import prisma from "../Config/config";
import { hashPassword } from "../Utils/utilities";

export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) throw new Error("Not LoggedIn..");
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
export const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not logged in" });
    const id = req.user.id;
    const { username, email, firstName, lastName, password } = req.body;
    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user)
      return res
        .status(404)
        .json({ error: "No user with the given Id found...." });
    const hashedPassword = await hashPassword(password);
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { username, email, firstName, lastName, password: hashedPassword },
    });
    res.json({ updatedUser });
  } catch (error) {
    next(error);
  }
};
export const deleteMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not logged in" });
    const id = req.user.id;
    await prisma.user.update({ where: { id: id }, data: { isDeleted: true } });
    res.status(200).json({ message: "User deleted successfully!.. " });
  } catch (error) {
    next(error);
  }
};
export const addShippingAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      return res.status(404).json({ message: "No User Found ..Login" });
    const userId = req.user.id;
    const {
      addressLine1,
      addressLine2,
      postalCode,
      city,
      state,
      country,
      isShippingAddress,
      addressType,
    } = req.body;
    if (isShippingAddress) {
      await prisma.userAddress.updateMany({
        where: { userId: userId, isShippingAddress: true },
        data: { isShippingAddress: false },
      });
    }

    const newAddress = await prisma.userAddress.create({
      data: {
        userId: userId,
        addressLine1,
        addressLine2,
        postalCode,
        city,
        state,
        country,
        isShippingAddress,
        addressType,
      },
    });
    return res
      .status(201)
      .json({ message: "Address added successfully:- ", newAddress });
  } catch (error) {
    next(error);
  }
};
export const viewAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(400).json({ message: "Login.." });
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const addresses = await prisma.userAddress.findMany({
      where: { userId: req.user.id },
      orderBy: { id: "asc" },
      skip,
      take: limit,
    });
    const total = await prisma.userAddress.count({
      where: { userId: req.user.id },
    });

    if (total <= 0) throw new Error("No address found");

    return res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totaltems: total,
      addresses,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(400).json({ message: "Login.." });
    const { id } = req.params;
    const address = await prisma.userAddress.findUnique({
      where: { id: parseInt(id) },
    });
    if (!address) throw new Error("No Address found ");
    await prisma.userAddress.delete({
      where: { id: parseInt(id), userId: req.user.id },
    });
    return res.status(200).json({ message: "Address deleted successfully " });
  } catch (error) {
    next(error);
  }
};
