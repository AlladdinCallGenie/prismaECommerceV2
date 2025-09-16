import { Router } from "express";
import { login, register, forgetPassword, changePassword, resetPassword, sendLoginOtpEmail, verifyLoginOtpEmail, sendOtpSms, verifyOtpSms } from "../Controllers/auth";
import { UserSchema } from "../Validators/validations";
import { validate } from "../Middlewares/validate";
import { isAuthenticated } from "../Middlewares/auth";
const router = Router();

router.post("/register", validate(UserSchema), register);
router.post("/login", login);
router.put("/change-password", isAuthenticated, changePassword);
router.put("/forget-password", forgetPassword);
router.put("/reset-password", resetPassword);

//test email otp
router.post("/login-email", sendLoginOtpEmail);
router.post("/verify-email", verifyLoginOtpEmail);

//test sms otp
router.post("/send-otp", sendOtpSms);
router.post("/verify-otp", verifyOtpSms);

export default router;
