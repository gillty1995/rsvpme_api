import { Router } from "express";
import { registerUser, loginUser, getUserProfile, updateUserDetails, logoutUser } from "../controllers/userController";
import { verifyJWT } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser); 
router.get("/profile", verifyJWT, getUserProfile);
router.put("/profile", verifyJWT, updateUserDetails);

// Logout route (client will handle local JWT removal)
router.post("/logout", verifyJWT, logoutUser);

export default router;