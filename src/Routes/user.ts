import { updateMyProfile, getMyProfile, deleteMyProfile, addShippingAddress, viewAddresses, deleteAddress } from "../Controllers/user";
import { Router } from "express";
import { isAuthenticated } from "../Middlewares/auth";
const router = Router();

router.get("/profile", isAuthenticated, getMyProfile);
router.put("/profile", isAuthenticated, updateMyProfile);
router.delete("/profile", isAuthenticated, deleteMyProfile);
router.get("/address", isAuthenticated, viewAddresses);
router.post("/address", isAuthenticated, addShippingAddress);
router.delete("/address", isAuthenticated, deleteAddress);

export default router;
