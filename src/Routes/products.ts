import { Router } from "express";
import { getAllProducts, getProductById, getByCategory } from "../Controllers/products";
const router = Router();

router.get("/all", getAllProducts);
router.get("/category", getByCategory);
router.get("/:id", getProductById);

export default router;
