"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post("/register", userController_1.registerUser);
router.post("/login", authMiddleware_1.verifyJWT, userController_1.loginUser);
// router.get("/profile", verifyJWT, getUserProfile);
// router.put("/profile", verifyJWT, updateUserDetails);
// Logout route (client will handle local JWT removal)
router.post("/logout", authMiddleware_1.verifyJWT, (req, res) => {
    res.clearCookie("token", {
        domain: ".rsvpme.hec.to",
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "none",
    });
    res.status(200).json({ message: "Logged out successfully" });
});
exports.default = router;
