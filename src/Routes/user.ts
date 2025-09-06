import { 
    updateMyProfile, 
    getMyProfile, 
    deleteMyProfile, 
    addShippingAddress,
    viewAddresses 
} from "../Controllers/user";
import { Router } from "express";
import { isAuthenticated } from "../Middlewares/auth";
const router = Router();

router.get('/profile', isAuthenticated, getMyProfile);
router.put('/profile', isAuthenticated, updateMyProfile);
router.delete('/profile', isAuthenticated, deleteMyProfile);
router.post('/address', isAuthenticated, addShippingAddress);
router.get("/address", isAuthenticated, viewAddresses);

export default router;