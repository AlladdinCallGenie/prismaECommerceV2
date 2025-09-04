import { 
    updateMyProfile, 
    getMyProfile, 
    deleteMyProfile, 
    addShippingAddress 
} from "../Controllers/user";
import { Router } from "express";
import { isAuthenticated } from "../Middlewares/auth";
const router = Router()

router.get('/profile', isAuthenticated, getMyProfile)
router.put('/update', isAuthenticated, updateMyProfile)
router.delete('/delete', isAuthenticated, deleteMyProfile)
router.post('/address', isAuthenticated, addShippingAddress)

export default router;