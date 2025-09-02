import { Role } from "@prisma/client";
import { DiscountType } from "@prisma/client";
import { z } from "zod";

export const UserSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  username: z
    .string()
    .trim()
    .min(3, { message: "Name must be atleast 3 characters" })
    .max(100, { message: "Name must not be more than 100 characters" }),
  firstName: z
    .string()
    .trim()
    .min(1, { message: "firstName must be atleast 3 characters" })
    .max(100, { message: "firstName must not be more than 100 characters" }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "lastName must be atleast 3 characters" })
    .max(100, { message: "lastName must not be more than 100 characters" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "password must be atleast 8 characters" }),
  role: z.enum(Role).optional(),
});

const AddressSchema = z.object({
  userId: z.number().int().positive(),
  addressLine1: z
    .string()
    .min(10, { message: "address should not be less than 10 characters" })
    .max(255, { message: "address line 1 should not exceed 255 characters" }),
  addressLine2: z
    .string()
    .min(10, { message: "address should not be less than 10 characters" })
    .max(255, { message: "address line 2 should not exceed 255 characters" })
    .optional(),
  postalCode: z.number().int().positive(),
  city: z
    .string()
    .min(3, { message: "city name should not be less than 3 characters" })
    .max(200, { message: "city name should have max 200 characters" }),
  state: z
    .string()
    .min(3, { message: "state name should not be less than 3 characters" })
    .max(200, { message: "state name should have max 200 characters" }),
  country: z
    .string()
    .min(3, { message: "country name should not be less than 3 characters" })
    .max(200, { message: "contry name should have max 200 characters" }),
});

export const CategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "category name shouuld not be less than 3 characters" })
    .max(100, { message: "category length should not exceed 100 characters" }),
});

export const ProductSchema = z.object({
  categoryId: z.number().int().positive(),
  productName: z
    .string()
    .min(3, { message: "category name shouuld not be less than 3 characters" })
    .max(100, { message: "category length should not exceed 100 characters" }),
  productPrice: z.number().positive(),
  description: z
    .string()
    .min(3, { message: "category name shouuld not be less than 3 characters" })
    .max(100, { message: "category length should not exceed 100 characters" }),
  stock: z.number().int().positive(),
  discount: z.number().int().positive(),
  image: z.string(),
});

const CartSchema = z.object({
  userId: z.number().int().positive(),
});

const CartItemSchema = z.object({
  cartId: z.number().int().positive(),
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  price: z.number().int().positive(),
});

const OrderSchema = z.object({
  userId: z.number().int().positive(),
  shippingAddressId: z.number().int().positive(),
  couponId: z.number().int().positive().optional(),
  totalAmount: z.number().int().positive(),
  discountAmount: z.number().int().positive().optional(),
  finalAmount: z.number().int().positive().optional(),
});

const OrderItemSchema = z.object({
  orderId: z.number().int().positive(),
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  price: z.number().int().positive(),
});

const CouponSchema = z.object({
  code: z.string().min(3, {
    message: "Coupon length should be atleast 3 characters long",
  }),
  description: z
    .string()
    .min(3, {
      message: "description length should not be less than 3 characters",
    })
    .optional(),
  discountType: z.enum(DiscountType),
  discountValue: z.number().positive(),
  minOrderValue: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  validTo: z.date(),
});
