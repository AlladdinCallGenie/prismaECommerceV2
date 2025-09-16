import { Router } from "express";
import { addItemToCart, addToWishList, getWishlist, removeWishlistItem } from "../Controllers/wishlist";
import { isAuthenticated } from "../Middlewares/auth";

const router = Router();

router.get("/my-wishlist", isAuthenticated, getWishlist);
router.post("/add", isAuthenticated, addToWishList);
router.delete("/remove/:id", isAuthenticated, removeWishlistItem);
router.post("/cart", isAuthenticated, addItemToCart);

export default router;
