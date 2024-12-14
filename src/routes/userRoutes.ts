import { Router } from "express";
import { registerUser, loginUser, getUserProfile, updateUserDetails } from "../controllers/userController";
import { verifyJWT } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyJWT, getUserProfile);
router.put("/profile", verifyJWT, updateUserDetails);

export default router;