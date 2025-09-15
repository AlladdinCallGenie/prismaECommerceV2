import { Router } from "express";
import { myPlaceOrder, cancelOrder, orderHistory, checkStatus, repeateOrder } from "../Controllers/order";
import { isAuthenticated } from "../Middlewares/auth";

const router = Router();

router.post("/checkout", isAuthenticated, myPlaceOrder);
router.put("/cancel/:id", isAuthenticated, cancelOrder);
router.get("/history", isAuthenticated, orderHistory);
router.get("/status/:id", isAuthenticated, checkStatus);
router.post("/repeat/:orderId", isAuthenticated, repeateOrder);

//repeatOrder route
export default router;
