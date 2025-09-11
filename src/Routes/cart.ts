import { getCart, addToCart, dropCart, removeFromCart, updateCartItemQuantity } from "../Controllers/cart";
import { Router } from "express";
import { isAuthenticated } from "../Middlewares/auth";
const router = Router();

router.get("/mycart", isAuthenticated, getCart);
router.post("/add", isAuthenticated, addToCart);
router.put("/update", isAuthenticated, updateCartItemQuantity);
router.delete("/remove-item/:cartItemId", isAuthenticated, removeFromCart);
router.delete("/delete", isAuthenticated, dropCart);

export default router;
