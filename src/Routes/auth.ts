import { Router } from "express";
import { login, register } from "../Controllers/auth";
import { UserSchema } from "../Validators/validations";
import { validate } from "../Middlewares/validate";
const router = Router();

router.post("/register", validate(UserSchema), register);
router.post("/login", login);

export default router;
