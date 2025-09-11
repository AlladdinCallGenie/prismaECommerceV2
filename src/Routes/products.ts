import { Router } from "express";
import { getAllProducts, getProductById, getByCategory, skuById } from "../Controllers/products";
const router = Router();

router.get("/all", getAllProducts);
router.get("/category", getByCategory);
router.get("/:id", getProductById);
router.get("/sku/:id", skuById);

export default router;
