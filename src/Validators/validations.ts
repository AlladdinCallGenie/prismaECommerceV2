import { Role, AddressType, DiscountType } from "@prisma/client";
import { z } from "zod";

export const UserSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  username: z
    .string()
    .trim()
    .min(3, { message: "Name must be atleast 3 characters" })
    .max(100, { message: "Name must not be more than 100 characters" }),
  fullName: z
    .string()
    .trim()
    .min(1, { message: "full Name must be atleast 3 characters" })
    .max(150, { message: "firstName must not be more than 100 characters" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "password must be atleast 8 characters" }),
  phone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{1,14}$/, {
      message:
        "Phone must be in international format (E.164), e.g. +14155552671",
    }),
});

export const AddressSchema = z.object({
  addressLine1: z
    .string()
    .min(10, { message: "address should not be less than 10 characters" })
    .max(255, { message: "address line 1 should not exceed 255 characters" }),
  addressLine2: z.string().optional(),
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
  addressType: z.enum(AddressType),
  defaultAddress: z.boolean(),
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
  brand: z
    .string()
    .min(3, { message: "brand name shouuld not be less than 3 characters" })
    .max(50, { message: "brand name shouuld not be more than 50 characters" }),
  description: z
    .string()
    .min(3, { message: "category name shouuld not be less than 3 characters" })
    .max(300, { message: "category length should not exceed 300 characters" }),
  // skus: z
  //   .array(
  //     z.object({
  //       skuCode: z
  //         .string()
  //         .min(6, "skuCode should not be less than 6 characters"),
  //       attributes: z.record(z.string(), z.string()),
  //       productPrice: z.number().positive(),
  //       discount: z.number().min(0).max(100),
  //       stock: z.number().int().positive(),
  //     })
  //   )
  //   .optional(),
  // .min(1, "At least one SKU is required"),
});

export const SkuSchema = z.object({
  attributes: z.string(),
  skuCode: z
    .string()
    .min(6, { message: "skuCode should not be less than 6 characters" })
    .max(25, { message: "skuCode should not be less than 15 characters " }),
  productPrice: z.coerce.number().positive(),
  discount: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().positive(),
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

export const CouponSchema = z.object({
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
  validTo: z.string(),
});
