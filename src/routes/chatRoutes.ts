import express from "express";
import { getChatMessages, postChatMessage } from "../controllers/chatController";
import { verifyJWT } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/:eventId", verifyJWT, getChatMessages);
router.post("/:eventId", verifyJWT, postChatMessage);

export default router;