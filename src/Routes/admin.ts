import { Router } from "express";
import { isAuthenticated } from "../Middlewares/auth";
import { checkRole } from "../Middlewares/role";
import { Role } from "@prisma/client";
import { UserSchema, CategorySchema, ProductSchema, SkuSchema, CouponSchema } from "../Validators/validations";
import { validate } from "../Middlewares/validate";
import { upload } from "../Middlewares/multer";
import {
  createCategory,
  changeCategoryStatus,
  allcategories,
  getCategoryById,
  updateCategory,
  addProduct,
  updateProduct,
  addSku,
  updateSku,
  deleteSku,
  changeSkuStatus,
  allSkus,
  deleteProduct,
  changeProductStatus,
  allUsers,
  getById,
  updateUser,
  deleteUser,
  addCoupon,
  updateCoupon,
  changeCouponStatus,
  allCoupon,
  allOrders,
  updateStatus,
  changeUserStatus,
  deleteOrder,
  getAllAdminProducts,
} from "../Controllers/admin";

const router = Router();
// ---------->Admin User Routes<----------
router.get("/users", isAuthenticated, checkRole([Role.ADMIN]), allUsers);
router.get("/users/:id", isAuthenticated, checkRole([Role.ADMIN]), getById);
router.put("/users/:id", isAuthenticated, checkRole([Role.ADMIN]), validate(UserSchema), updateUser);
router.delete("/users/:id", isAuthenticated, checkRole([Role.ADMIN]), deleteUser);
router.put("/users/status/:id", isAuthenticated, checkRole([Role.ADMIN]), changeUserStatus);

// ---------->Admin Category Routes<----------
router.get("/categories", isAuthenticated, checkRole([Role.ADMIN]), allcategories);
router.post("/category", isAuthenticated, checkRole([Role.ADMIN]), validate(CategorySchema), createCategory);
router.get("/category/:id", isAuthenticated, checkRole([Role.ADMIN]), getCategoryById);
router.put("/category/status/:id", isAuthenticated, checkRole([Role.ADMIN]), changeCategoryStatus);
router.put("/category/:id", isAuthenticated, checkRole([Role.ADMIN]), validate(CategorySchema), updateCategory);

// ---------->Admin Product Routes<----------
router.post("/product", isAuthenticated, checkRole([Role.ADMIN]), validate(ProductSchema), addProduct);
router.put("/product/:id", isAuthenticated, checkRole([Role.ADMIN]), validate(ProductSchema), updateProduct);
router.delete("/product/:id", isAuthenticated, checkRole([Role.ADMIN]), deleteProduct);
router.put("/product/status/:id", isAuthenticated, checkRole([Role.ADMIN]), changeProductStatus);
router.get("/products", isAuthenticated, checkRole([Role.ADMIN]), getAllAdminProducts);
// sku's 
router.post("/sku/:productId", isAuthenticated, checkRole([Role.ADMIN]), upload.array("images",5), validate(SkuSchema), addSku);
router.put("/sku/:id", isAuthenticated, checkRole([Role.ADMIN]), upload.array("images",5), validate(SkuSchema), updateSku);
router.delete("/sku/:id", isAuthenticated, checkRole([Role.ADMIN]), deleteSku);
router.put("/sku/status/:id", isAuthenticated, checkRole([Role.ADMIN]), changeSkuStatus);
router.get("/sku/all", isAuthenticated, checkRole([Role.ADMIN]), allSkus);

// ---------->Admin Coupon Routes<----------
router.get("/coupons", isAuthenticated, checkRole([Role.ADMIN]), allCoupon);
router.post("/coupon", isAuthenticated, checkRole([Role.ADMIN]), validate(CouponSchema), addCoupon);
router.put("/coupon/:id", isAuthenticated, checkRole([Role.ADMIN]), validate(CouponSchema), updateCoupon);
router.put("/coupon/status/:id", isAuthenticated, checkRole([Role.ADMIN]), changeCouponStatus);

// ---------->Admin Order Routes<----------
router.get("/orders/all", isAuthenticated, checkRole([Role.ADMIN]), allOrders);
router.put("/order/:id", isAuthenticated, checkRole([Role.ADMIN]), updateStatus);

//for testing purpose only
router.delete("/order/remove/:id", isAuthenticated, checkRole([Role.ADMIN]), deleteOrder);
export default router;
