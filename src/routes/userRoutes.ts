import { Router } from "express";
import { registerUser, loginUser } from "../controllers/userController";
import { verifyJWT } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", verifyJWT, loginUser); 
// router.get("/profile", verifyJWT, getUserProfile);
// router.put("/profile", verifyJWT, updateUserDetails);

// Logout route (client will handle local JWT removal)
router.post("/logout", verifyJWT, (req, res) => {
    res.clearCookie("token", {
      domain: ".rsvpme.mine.bz",
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "Logged out successfully" });
  });
  

export default router;