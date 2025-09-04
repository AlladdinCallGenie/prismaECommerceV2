import { Router } from "express";
import { isAuthenticated } from "../Middlewares/auth";
import { checkRole } from "../Middlewares/role";
import { Role } from "@prisma/client";
import { UserSchema, CategorySchema, ProductSchema } from "../Validators/validations";
import { validate } from "../Middlewares/validate";
import { upload } from "../Middlewares/multer";
import {
  createCategory,
  deleteCategory,
  allcategories,
  getCategoryById,
  addProduct,
  updateProduct,
  deleteProduct,
  deActiveProduct,
  activateProduct,
  allProducts,
  allUsers,
  getById,
  updateUser,
  deleteUser,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  activateCoupon,
  allCoupon,
} from "../Controllers/admin";

const router = Router();
// ---------->Admin User Routes<----------
router.get("/users", isAuthenticated, checkRole([Role.ADMIN]), allUsers);
router.get("/users/:id", isAuthenticated, checkRole([Role.ADMIN]), getById);
router.put("/users/:id", isAuthenticated, checkRole([Role.ADMIN]), validate(UserSchema), updateUser);
router.delete("/users/:id", isAuthenticated, checkRole([Role.ADMIN]), deleteUser);

// ---------->Admin Category Routes<----------
router.get("/categories", isAuthenticated, checkRole([Role.ADMIN]), allcategories);
router.post("/category", isAuthenticated, checkRole([Role.ADMIN]), validate(CategorySchema), createCategory);
router.get("/category/:id", isAuthenticated, checkRole([Role.ADMIN]), getCategoryById);
router.delete("/category/:id", isAuthenticated, checkRole([Role.ADMIN]), deleteCategory);

// ---------->Admin Product Routes<----------
router.post("/product", isAuthenticated, checkRole([Role.ADMIN]), upload.single("image"), addProduct);
router.put("/product/:id", isAuthenticated, checkRole([Role.ADMIN]), validate(ProductSchema), updateProduct);
router.delete("/product/delete/:id", isAuthenticated, checkRole([Role.ADMIN]), deleteProduct);
router.put("/product/deactive/:id", isAuthenticated, checkRole([Role.ADMIN]), deActiveProduct);
router.put("/product/active/:id", isAuthenticated, checkRole([Role.ADMIN]), activateProduct);
router.get("/products", isAuthenticated, checkRole([Role.ADMIN]), allProducts);

// ---------->Admin Coupon Routes<----------
router.get("/coupons", isAuthenticated, checkRole([Role.ADMIN]), allCoupon);
router.post("/coupon", isAuthenticated, checkRole([Role.ADMIN]), addCoupon);
router.put("/coupon/:id", isAuthenticated, checkRole([Role.ADMIN]), updateCoupon);
router.delete("/coupon/delete/:id", isAuthenticated, checkRole([Role.ADMIN]), deleteCoupon);
router.put("/coupon/activate/:id", isAuthenticated, checkRole([Role.ADMIN]), activateCoupon);

// ---------->Admin Order Routes<----------
// get all orders
// updated orderstatus
export default router;
