import { Router } from "express";
import { login, register, forgetPassword, changePassword, resetPassword } from "../Controllers/auth";
import { UserSchema } from "../Validators/validations";
import { validate } from "../Middlewares/validate";
import { isAuthenticated } from "../Middlewares/auth";
const router = Router();

router.post("/register", validate(UserSchema), register);
router.post("/login", login);
router.put("/change-password", isAuthenticated, changePassword);
router.put("/forget-password", forgetPassword);
router.put("/reset-password", resetPassword);

export default router;

