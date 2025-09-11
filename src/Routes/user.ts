import { updateMyProfile, getMyProfile, deleteMyProfile, addShippingAddress, viewAddresses, deleteAddress } from "../Controllers/user";
import { Router } from "express";
import { isAuthenticated } from "../Middlewares/auth";
import { validate } from "../Middlewares/validate";
import { AddressSchema, UserSchema } from "../Validators/validations";
const router = Router();

router.get("/profile", isAuthenticated, getMyProfile);
router.put("/profile", isAuthenticated, validate(UserSchema), updateMyProfile);
router.delete("/profile", isAuthenticated, deleteMyProfile);
router.get("/address", isAuthenticated, viewAddresses);
router.post("/address", isAuthenticated, validate(AddressSchema), addShippingAddress);
router.delete("/address/:id", isAuthenticated, deleteAddress);

export default router;
