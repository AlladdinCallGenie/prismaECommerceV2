import { Router } from "express";
import { getAllProducts, getProductById, getByCategory } from "../Controllers/products";
const router = Router();

router.get("/all", getAllProducts);
router.get("/:id", getProductById);
router.get("/category", getByCategory);

export default router;
