import { Router } from "express";
import { placeOrder, cancelOrder, orderHistory, checkStatus } from "../Controllers/order";
import { isAuthenticated } from "../Middlewares/auth";

const router = Router();

router.post("/checkout", isAuthenticated, placeOrder);
router.put("/cancel/:id", isAuthenticated, cancelOrder);
router.get("/history", isAuthenticated, orderHistory);
router.get("/status/:id", isAuthenticated, checkStatus);

//repeatOrder route
export default router;
